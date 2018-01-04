var express = require('express');
var fs=require('fs'); //文件操作
var app=express(); //创建web应用程序

var bodyParser = require('body-parser');
var urlencodeParser = bodyParser.urlencoded({extend: false});

app.use(express.static('public'));
app.use(bodyParser.urlencoded({extend: false}));

var multer = require('multer');

app.use(multer({dest: './upload-dir/'}).array('images'));

app.get('/upload.html',function (req,res) {
    res.sendfile(__dirname+'/upload.html');
});

/*upload.array(fieldname[, maxCount])
.fields(fields)
[{name:'file1',maxCount:1},
{name:'file2',maxCount: 8 }]
*/

app.post('/upload', function(req, res) {
    console.log('req.files: ' + req.files);
    if(req.files==undefined){
        res.send("请选择要上传的图片...");
    }else{
        var str="文件上传成功...";
        for(var i=0;i<req.files.length;i++){
            var filepath = __dirname + "/upload-dir/" + req.files[i].originalname;
            fs.renameSync(req.files[i].path,filepath);
        }
        res.send("上传的图片成功...");
    }
});

var server = app.listen(4000, function(){
    var host = server.address().address;
    var port = server.address().port;
    console.log("应用实例，访问地址为：http://%s:%s",host,port);
})