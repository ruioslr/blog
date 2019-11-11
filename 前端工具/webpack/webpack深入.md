# webpack 插件开发

## 什么是插件

## Compiler hook

environment -> afterEnvironment -> entryOption(WebpackOptionsApply) -> beforeRun -> run -> normalModuleFactory -> contextModuleFactory -> beforeCompile -> compile -> (创建 compilation 对象) -> thisCompilation -> compilation -> make -> [ **开始构建** SingleEntryPlugin (各种 entryPlugin)] -> |||||{(**compilation hook**) addEntry ->  

 {**moduleFactory hook ** beforeResolve -> factory(moduleFactory构造函数上绑定了方法)  -> resolver(moduleFactory 构造函数上绑定了方法, 解析模块) -> afterResolve -> createModule(更具解析结果生成module (NormalModle 或 其他)，调用的是 moduleFactory 的 create 方法) -> module } -> buildModule(一个module) -> succeedModule(一个module) -> succeedEntry ->finishModules -> seal -> optimizeDependenciesBasic -> optimizeDependencies -> optimizeDependenciesAdvanced -> afterOptimizeDependencies -> beforeChunks -> afterChunks -> optimize -> optimizeModulesBasic -> optimizeModules -> optimizeModulesAdvanced -> afterOptimizeModules -> optimizeChunksBasic -> optimizeChunks-> optimizeChunksAdvanced -> afterOptimizeChunks -> optimizeTree -> [ afterOptimizeTree -> optimizeChunkModulesBasic -> ... -> beforeHash -> afterHash ->   beforeModuleAssets -> additionalChunkAssets -> additionalAssets -> optimizeChunkAssets -> afterOptimizeAssets -> (if needAdditionalSeal return true (seal -> ...)) -> afterSeal] }||||| -> afterCompile -> shouldEmit (return false needAdditionalPass -> additionalPass -> beforeCompile -> ...) -> emit ->  done | fail


## Compilation 方法调用顺序



addEntry -> _addModuleChain -> (moduleFactory.create 生成（NormalModule 或 其他) 后 放入 compilation 对象的 moudle 数组) -> buildModule (build 完成，并解析所有所有依赖，放入当前的module的dependencies属性) -> processModuleDependencies(对 dependencies做一些处理， 比如 排序） -> [addModuleDependencies（遍历dependencies对每一个dependence执行 moduleFactory.create（放入 module 数组） -> buildModule[调用 module.build (NormalModule 或其他module 的 doBuild)] -> processModuleDependencies -> addModuleDependencies)]