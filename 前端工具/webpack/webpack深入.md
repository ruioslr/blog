# webpack 插件开发

## 什么是插件

## Compiler hook

environment -> afterEnvironment -> entryOption(WebpackOptionsApply) -> beforeRun -> run -> normalModuleFactory -> contextModuleFactory -> beforeCompile -> compile -> (创建 compilation 对象) -> thisCompilation -> compilation -> make -> |{(**compilation hook**) finishModules -> seal -> optimizeDependenciesBasic -> optimizeDependencies -> optimizeDependenciesAdvanced -> afterOptimizeDependencies -> beforeChunks -> afterChunks -> optimize -> optimizeModulesBasic -> optimizeModules -> optimizeModulesAdvanced -> afterOptimizeModules -> optimizeChunksBasic -> optimizeChunks-> optimizeChunksAdvanced -> afterOptimizeChunks -> optimizeTree -> [ afterOptimizeTree -> optimizeChunkModulesBasic -> ... ->  beforeModuleAssets -> additionalChunkAssets -> additionalAssets -> optimizeChunkAssets -> afterOptimizeAssets -> (if needAdditionalSeal return true (seal -> ...)) -> afterSeal] }| -> afterCompile -> shouldEmit (return false needAdditionalPass -> additionalPass -> beforeCompile -> ...) -> done | fail
