# UserJS
firefox 插件，api库，提供方便的底层接口调用。插件安装，整个项目ZIP包，拖入浏览器。
|-content //插件内容文件夹

　　|-datebase

　　　　DateBase.js//sqlite数据库操作

　　|-img

　　　　Canvas.js//获取图像的base64数据或保存网页为图片

　　|-io（这个用的比较少，有的可能api，只是其他插件的重写下）

　　　　_FILE_BASE.js//系统文件描述符

　　　　DIR_UTILS.js//文件夹公用函数

　　　　File.js//文件操作

　　　　File_base.js//文件操作

　　|-network

　　　　Ajax.js//ajax功能封装1.0

　　　　Ajax2.js//ajax功能封装2.0

　　　　CACHE.js//浏览器内存控制

　　　　COOKIES.js//浏览器cookie控制

　　　　HTTP_OBSERVER.js//http请求监听

　　　　PROXY_OBSERVER.js//浏览器代理设置

　　　　POP.js//基于pop,socket与服务器通信

　　　　SMTP.js//基于SMTP,socket与服务器通信

　　　　ServerSocket.js//服务器端socket代码

　　　　Socket.js//客户端socket

　　|-other

　　　　保存的插件代码

　　|-server

　　　　httpd.js//httpserver//来源于别的项目

　　|-UserJS//自己用的脚本，功能更加强，涉及安全问题，可以用于黑客技术

　　　　network

　　　　　　Ajax3.js//ajax功能封装3.0

　　　　　　COOKIE_MANAGE//浏览器cookie管理，结合数据库（可以做多马甲浏览器）

　　　　　　COOKIE_MANAGE_AND.js//浏览器cookie管理，无数据库

　　　　　　HTTP_OBSERVER.js//HTTP请求响应的拦截，监控，可以修改返回，或制定返回文件

　　　　　　HTTP_OBSERVER-53.js//以前一个版本的保存

　　　　　　INFO_MANAGE.js//帐号信息管理

　　　　　　OPTS_MANAGE.js//数据库初始化

　　|-utils

　　　　_TIMER.js//浏览器级别定时器api封装

　　　　CLEAR.js//清空浏览器缓存功能（cookie,历史，flash 等）

　　　　CONFIG.js//开启java,js功能

　　　　dateFormat.js//时间格式化

　　　　Group.js//组管理(用于定时任务，定时)

　　　　jsBeautify.js

　　　　PATH_MANAGE.js//路径管理，资源文件和实际文件路径，等相关功能

　　　　Post.js//定时任务系统，主要是开发了个多帐号抢楼层逻辑

　　　　Prefs.js//配置Prefs管理

　　　　RSA.js//RSA加密

　　　　Timer.js//定时器

　　　　Worker.js//多任务管理，定时任务管理

　　　　UTIL.js//公用库（md5,迭代器，加载脚本，编码转换，浏览器提示，通过调进程切换IP）

　　init.js//插入chrome的初始化文件

　　options.json//配置短路径配置文件，主要用于require

　　overlay.xul//插件载入，修改chrome元素的信息xul文件

|-defaults //插件多语言等信息的文件夹

chrome.manifest //FF注册资源文件

install.rd f//FF插件信息文件
