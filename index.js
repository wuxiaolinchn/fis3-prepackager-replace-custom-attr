'use strict';

var path = require('path');

module.exports = function (ret, conf, settings, opt) {

  if(!settings.attr instanceof Array) {
    return false;
  }

  // 逐一处理设置的属性
  settings.attr.forEach(function(_attr) {
    
    // TODO 补充正则表达式，不处理模板表达式、非本地路径。可参考fis源代码
    // https://github.com/fex-team/fis3/blob/c37e9e939b487e90c0ed54336ec21779ae109be8/lib/compile.js
    var reg = new RegExp(_attr + '=["\']([^"\']+)["\']', 'ig');
    // 逐一处理每个文件对象
    for(var key in ret.src) {

      var file = ret.src[key];

      // 如果文件对象的isHtmlLike属性是true，即在html元素才能自定义元素
      if (file.isHtmlLike) {

        // 处理文件内容中
        var content = file.getContent().replace(reg, function (match, p1, offset, string) {
          
          // 无效资源路径
          if (/\/\//ig.test(p1)){
            return match;
          }

          // 解析资源key，用此key获得文件对象，从文件对象中获取编译后的资源路径
          var subdirname = file.subdirname || "/";
          var _file = path.resolve(subdirname, p1);

          if(!ret.src[_file]) {
            console.error('\n在处理文件'+ key +'时，未找到文件' + _file + '，将不对字符串' + p1 + '进行替换');
            return match;
          }

          // 添加链接
          file.addLink(_file);

          // 处理相对地址
          var relative = {
            target: ret.src[_file],
            file: file
          };
          fis.emit('plugin:relative:fetch', relative);

          // 替换url地址
          var _url = '';
          if (relative.ret) {
            _url = relative.ret;
          } else {
            _url = ret.src[_file].getUrl();
          }

          return _attr + '=\"' + _url + '\"';
        });

        // 设置文件内容
        file.setContent(content);
      }
    }
  })
};
