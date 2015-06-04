/**
 * Created by MengLei on 2015/6/3.
 */
var formidable = require('formidable');
var fs = require('fs-extra');
var path = require('path');
var rack = require('hat').rack();
var result = require('./result');

module.exports = function (req, res) {
    //
    //生成八位日期字符串
    var curDate = new Date();
    var year = curDate.getFullYear().toString();
    var month = (curDate.getMonth() + 1).toString();
    month = month.length < 2 ? '0' + month : month;
    var date = curDate.getDate().toString();
    date = date.length < 2 ? '0' + date : date;
    var dateStr = year + month + date;

    var staticPath = path.join(__dirname, './public');


    var form = new formidable.IncomingForm();

    try {

        //上传的文件按照日期进行存放，每天建立一个文件夹，存放当天上传的所有文件，日期文件夹格式yyyyMMdd
        //所有的上传文件都重新生成一个随机的字符串作为文件名，文件后缀不变。
        form.parse(req, function (err, fields, files) {
            if (err) {
                console.log('upload file excption: ' + err.message);
                result(res, {statusCode: 905, message: err.message});
            } else {
                try {
                    var name = files.upload.name;
                    var tmpPath = files.upload.path;
                    var filePath = path.join('upload', dateStr, rack() + path.extname(name).toLowerCase());
                    var destPath = path.join(staticPath, filePath);
                    fs.move(tmpPath, destPath, function (err) {
                        if (err) {
                            //handle error
                            console.log('upload file excption: ' + err.message);
                            result(res, {statusCode: 905, message: err.message});
                        } else {
                            //success，输出结果使用正斜线，如果server运行在win系统下，则路径中分隔符是反斜线，此处要进行替换
                            var outputPath = filePath.replace(/\\/g, '/');
                            result(res, {statusCode: 900, filePath: outputPath});
                            console.log('upload file success: ' + outputPath);
                        }
                    });
                } catch (ex) {
                    result(res, {statusCode: 905, message: ex.message});
                }
            }
        });
    } catch (ex) {
        console.log('upload file excption: ' + ex.message);
    }
};