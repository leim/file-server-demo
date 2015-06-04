var fileServer = {};
module.exports = fileServer;

fileServer.start = function () {
  var express = require('express');
  var upload = require('./upload');

  var app = express();

//注入log记录功能
//log.use(app);

//静态目录
  app.use(express.static(require('path').join(__dirname, './public')));

  //post方法上传文件
  app.post('/upload', upload);

  //测试页面
  app.get('/test', function (req, res) {
    // show a file upload form
    res.writeHead(200, {'content-type': 'text/html'});
    res.end(
        '<form action="/upload" enctype="multipart/form-data" method="post">' +
        //'<input type="text" name="title"><br>' +
        '<input type="file" name="upload" multiple="multiple"><br>' +
        '<input type="submit" value="Upload">' +
        '</form>'
    );
  });


//start http service
  app.listen(function () {
    console.log('file server http port listening on localhost');
  });
};

fileServer.start();