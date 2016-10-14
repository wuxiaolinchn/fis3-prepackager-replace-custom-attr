FIS3本身不支持自定义属性的资源替换，在别人代码基础上完善了一下。

## 插件地址
https://www.npmjs.com/package/fis3-prepackager-replace-custom-attr

## 使用方法

先用npm安装上面的插件，然后在fis配置文件最后增加如下配置：

```javascript
fis.match('::package', {
	prepackager: fis.plugin('replace-custom-attr', {
		attr : ['data-echo']
	}, 'append')
});
```