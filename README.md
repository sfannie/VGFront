# VGFront

前端框架

vue + requireJS + gulp + es6 + ejs + less

目录说明：

  www:  开发目录
    - modules:  js目录
    - less: less目录
    - js: 公共js
    - libs: 第三方js

  templates: ejs模板目录

  routes: 路由目录

  dist: 发布目录

  src: 项目源文件目录


构建步骤：

1. npm init


2. 服务器搭建

 2.1 编写server.js

 2.2 安装插件
  命令： npm install xxx —save-dev

  express
  body-parser
  ejs
  path
  gulp-util
  express-less
  
3. 编写gulpfile.js

 3.1 安装插件
  gulp              基础库
  gulp-clean        清空文件夹
  gulp-ejs     
  gulp-less  
  gulp-minify-css   css压缩
  gulp-uglify       js压缩
  gulp-htmlmin      html压缩
  gulp-rename       重命名
  gulp-concat       合并js文件
  gulp-dev          对文件名加MD5后缀   
  yargs             获取启动参数  
  gulp-util         时间格式化
  underscore
  gulp-run-sequence gulp顺序执行任务
  gulp-babel        将ES6代码编译成ES5
  gulp-cdnify       替换成cdn路径
  amd-optimize      require优化
  glob              规则匹配
  gulp-cached       增加缓存
  merge-stream      在一个任务中使用多个文件来源,把不同文件放到不同文件夹

  gulp-css-replace-url
  gulp-timestamp-css-url


 3.2 打包流程

  -> 清空目录
  -> less文件编译并拷贝到dist目录
  -> ejs文件编译并拷贝到dist目录
  -> 公共js文件合并并拷贝到dist目录
  -> js文件优化
  -> 拷贝源文件
  -> 

  4. 打包命令
    gulp build --env UAT/FAT/PRD




