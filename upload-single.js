var express = require('express');
var fs=require('fs'); //文件操作
var app=express(); //创建web应用程序

var bodyParser = require('body-parser');

app.use(express.static('public'));
app.use(bodyParser.urlencoded({extend: false}));

var multer = require('multer');
app.use(multer({dest: './upload-dir/'}).array('images'));

app.get('/upload.html',function (req,res) {
    res.sendfile(__dirname+'/upload.html');
});


app.post('/upload', function(req,res){
    console.log(req.files[0]);//上传的文件信息
    var des_file = __dirname + '/upload-dir/' + req.files[0].originalname;
    fs.readFile(req.files[0].path,function(error,data){
        fs.writeFile(des_file, data, function(error){
            if(error) {
                console.log(error);
            }else{
                response = {
                    message: "file upload successfully",
                    filename: req.files[0].originalname
                };
            }
            console.log(response);
            res.end(JSON.stringify(response));
        });
    });
})

var server = app.listen(4000, function(){
    var host = server.address().address;
    var port = server.address().port;
    console.log("应用实例，访问地址为：http://%s:%s",host,port);
})