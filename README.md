# Vue 3 + TypeScript + Vite
用于管理后台模板，基于element-plus组件二次封装功能


## 目录结构
   - apis 存放接口
   - assets 静态资源，图片或者字体文件，文档
   - components 公共组件，二次封装组件
   - hooks 公共的hooks，业务逻辑hooks
   - router 路由信息
   - stores 全局状态管理
   - styles 公共样式
   - types 项目变量类型
   - utils 工具方法
   - views 页面文件


## 项目说明
vite.config.js配置封装完毕
1.使用插件 rolluo-plugin-visuallizer 查看代码分析
2.使用插件 unplugin-auto-import/vite 自动引入vue的函数
3.配置路径别名，并且配置引入时不写后缀，自动匹配
4.打包时指定目录，分开测试，正式环境，打包
5.配置代理，请求接口
6.引入环境变量，测试环境时显示源码map，console,正式则取消

## 文档地址

