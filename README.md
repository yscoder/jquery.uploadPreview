# jquery.uploadPreview.js v0.0.2

[Demo](http://yscoder.github.io/jquery.uploadPreview/Demo.html)

## 更新
新增参数：
+ fillBox: true 图片充满容器，false 等比缩放。

# jquery.uploadPreview.js v0.0.1
图片上传本地预览插件

## 浏览器兼容性
IE7+、火狐、谷歌。

## 参数
+ width: 图片容器宽度；
+ height: 图片容器高度；
+ imgDiv: 图片预览容器；
+ anyTarget: 其他关联容器，多个容器逗号隔开；
+ maxSize: 图片大小限制，单位KB；
+ imgType: 图片类型限制；
+ callback: 预览成功后的回调，参数 img(预览的图片节点，jquery类型)。

> 可搭配 jquery.Jcrop 等图像裁剪插件使用更佳！
