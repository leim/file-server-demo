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
    //���ɰ�λ�����ַ���
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

        //�ϴ����ļ��������ڽ��д�ţ�ÿ�콨��һ���ļ��У���ŵ����ϴ��������ļ��������ļ��и�ʽyyyyMMdd
        //���е��ϴ��ļ�����������һ��������ַ�����Ϊ�ļ������ļ���׺���䡣
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
                            //success��������ʹ����б�ߣ����server������winϵͳ�£���·���зָ����Ƿ�б�ߣ��˴�Ҫ�����滻
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