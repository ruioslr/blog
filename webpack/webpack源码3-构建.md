---
title: Webpack源码-构建
categories:
 - webpack
tags:
 - webpack
 - webpack 源码
 - 源码
---

# Webpack源码-构建

## 找到入口

上文讲到，通过触发```compiler.hooks.make```钩子正式进入构建阶段，全局搜索注册了这个钩子的事件：

![compiler.hooks.make出现的地方](../asserts/img/compile.make.tap.png)

可以看到，主要是*EntryPlugin*注册了它,webpack会更具配置中的*entry*类型决定使用哪一个plugin,而这里的判断逻辑来自于上文中创建compiler前调用的```new WebpackOptionsApply().process(options, compiler)```中的 
```js
new EntryOptionPlugin().apply(compiler);
```

具体看看*EntryOptionPlugin().apply*:
```js
	apply(compiler) {
		compiler.hooks.entryOption.tap("EntryOptionPlugin", (context, entry) => {
			if (typeof entry === "string" || Array.isArray(entry)) {
				itemToPlugin(context, entry, "main").apply(compiler);
			} else if (typeof entry === "object") {
				for (const name of Object.keys(entry)) {
					itemToPlugin(context, entry[name], name).apply(compiler);
				}
			} else if (typeof entry === "function") {
				new DynamicEntryPlugin(context, entry).apply(compiler);
			}
			return true;
		});
	}
```

这里以对象形式的entry为例，遍历对象的每一项，最终每一项都调用*SingleEntryPlugin*

```js
// SingleEntryPlugin

	apply(compiler) {
		compiler.hooks.compilation.tap(
			"SingleEntryPlugin",
			(compilation, { normalModuleFactory }) => {
				compilation.dependencyFactories.set(
					SingleEntryDependency,
					normalModuleFactory
				);
			}
		);

		compiler.hooks.make.tapAsync(
			"SingleEntryPlugin",
			(compilation, callback) => {
				const { entry, name, context } = this;

				const dep = SingleEntryPlugin.createDependency(entry, name);
				compilation.addEntry(context, dep, name, callback);
			}
		);
	}
```
SingleEntryPlugin会注册*compiler.hooks.make*,所以```compiler.hooks.make```触发后，会继续接下来的流程：根据entry创建dependency，然后调用```compilation.addEntry(context, dep, name, callback);```

::: details 查看compilation.addEntry方法
```js
	addEntry(context, entry, name, callback) {
		this.hooks.addEntry.call(entry, name);

		const slot = {
			name: name,
			// TODO webpack 5 remove `request`
			request: null,
			module: null
		};

		if (entry instanceof ModuleDependency) {
			slot.request = entry.request;
		}

		// TODO webpack 5: merge modules instead when multiple entry modules are supported
		const idx = this._preparedEntrypoints.findIndex(slot => slot.name === name);
		if (idx >= 0) {
			// Overwrite existing entrypoint
			this._preparedEntrypoints[idx] = slot;
		} else {
			this._preparedEntrypoints.push(slot);
		}
		this._addModuleChain(
			context,
			entry,
			module => {
				this.entries.push(module);
			},
			(err, module) => {
				if (err) {
					this.hooks.failedEntry.call(entry, name, err);
					return callback(err);
				}

				if (module) {
					slot.module = module;
				} else {
					const idx = this._preparedEntrypoints.indexOf(slot);
					if (idx >= 0) {
						this._preparedEntrypoints.splice(idx, 1);
					}
				}
				this.hooks.succeedEntry.call(entry, name, module);
				return callback(null, module);
			}
		);
	}
```
:::

::: tip
可以看到在这个方法中会触发*compilation.hooks.addEntry*钩子，也就是说在编写插件的时候可以注册这个钩子，但是官方文档中并没有写这个钩子。类似的情况还有很多，例如normalModuleFactory.hooks.beforeResolve钩子，这些钩子都可以在编写插件时注册，但是官方文档里并没有列出。
:::

在*compilation.addEntry*方法中，会将entry缓存在*_preparedEntrypoints*数组上，接着调用*compilation._addModuleChain*方法。

::: details 查看compilation._addModuleChain方法
```js
	_addModuleChain(context, dependency, onModule, callback) {
		const start = this.profile && Date.now();
		const currentProfile = this.profile && {};

		const errorAndCallback = this.bail
			? err => {
					callback(err);
			  }
			: err => {
					err.dependencies = [dependency];
					this.errors.push(err);
					callback();
			  };

		if (
			typeof dependency !== "object" ||
			dependency === null ||
			!dependency.constructor
		) {
			throw new Error("Parameter 'dependency' must be a Dependency");
		}
		const Dep = /** @type {DepConstructor} */ (dependency.constructor);
		const moduleFactory = this.dependencyFactories.get(Dep);
		if (!moduleFactory) {
			throw new Error(
				`No dependency factory available for this dependency type: ${dependency.constructor.name}`
			);
		}

		this.semaphore.acquire(() => {
			moduleFactory.create(
				{
					contextInfo: {
						issuer: "",
						compiler: this.compiler.name
					},
					context: context,
					dependencies: [dependency]
				},
				(err, module) => {
					if (err) {
						this.semaphore.release();
						return errorAndCallback(new EntryModuleNotFoundError(err));
					}

					let afterFactory;

					if (currentProfile) {
						afterFactory = Date.now();
						currentProfile.factory = afterFactory - start;
					}

					const addModuleResult = this.addModule(module);
					module = addModuleResult.module;

					onModule(module);

					dependency.module = module;
					module.addReason(null, dependency);

					const afterBuild = () => {
						if (addModuleResult.dependencies) {
							this.processModuleDependencies(module, err => {
								if (err) return callback(err);
								callback(null, module);
							});
						} else {
							return callback(null, module);
						}
					};

					if (addModuleResult.issuer) {
						if (currentProfile) {
							module.profile = currentProfile;
						}
					}

					if (addModuleResult.build) {
						this.buildModule(module, false, null, null, err => {
							if (err) {
								this.semaphore.release();
								return errorAndCallback(err);
							}

							if (currentProfile) {
								const afterBuilding = Date.now();
								currentProfile.building = afterBuilding - afterFactory;
							}

							this.semaphore.release();
							afterBuild();
						});
					} else {
						this.semaphore.release();
						this.waitForBuildingFinished(module, afterBuild);
					}
				}
			);
		});
	}

```
:::

*compilation._addModuleChain*主要是通过上面由entry创建的*dependency*.constructor(这里是SingleEntryDependency)获取对应的*moduleFactory*(这里是NomalModuleFactory)，接着在*semaphore.acquire*中调用*moduleFactory.create*开始解析生成*wepback模块*。

这里有两个需要解释的点：
* emaphore.acquire是什么
* 如何解析生成模块

## emaphore.acquire是什么

在创建*compilation实例时*，会执行代码：
```js
this.semaphore = new Semaphore(options.parallelism || 100);

// Semaphore类
class Semaphore {
	/**
	 * Creates an instance of Semaphore.
	 *
	 * @param {number} available the amount available number of "tasks"
	 * in the Semaphore
	 */
	constructor(available) {
		this.available = available;
		/** @type {(function(): void)[]} */
		this.waiters = [];
		/** @private */
		this._continue = this._continue.bind(this);
	}

	/**
	 * @param {function(): void} callback function block to capture and run
	 * @returns {void}
	 */
	acquire(callback) {
		if (this.available > 0) {
			this.available--;
			callback();
		} else {
			this.waiters.push(callback);
		}
	}

	release() {
		this.available++;
		if (this.waiters.length > 0) {
			process.nextTick(this._continue);
		}
	}

	_continue() {
		if (this.available > 0) {
			if (this.waiters.length > 0) {
				this.available--;
				const callback = this.waiters.pop();
				callback();
			}
		}
	}
}

```
*Semaphore* 这个类是一个编译队列控制，原理很简单，对执行进行了并发控制，默认并发数为 100，超过后存入 semaphore.waiters，根据情况再调用 semaphore.release 去执行存入的事件 semaphore.waiters。

## 解析生成模块

从上一篇文章可以知道，调用*normalModuleFactory.create*触发*normalModuleFactory.hooks.factory*钩子生成*factory*,然后调用factory来生成模块。