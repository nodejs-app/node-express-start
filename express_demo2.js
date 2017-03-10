var express = require('express');
var app = express();

//get请求
app.get('/', function(req,res){
    console.log("主页Get请求");
    res.send('Hello Get');
})

//post请求
app.post('/',function(req,res){
	console.log("主页Post请求");
    res.send('Hello Post');
})

// /del_user 页面响应
app.delete('/del_user', function(req,res){
	console.log("/del_user 响应delete请求");
	res.send('删除页面');
})

// /list_user 页面get请求
app.get('/list_user', function(req,res){
	console.log("/list_user get请求");
	res.send('用户列表页面');
})

app.get('/ab*cd', function(req,res){
	console.log("/ab*cd get请求");
	res.send('正则匹配');
})

var server = app.listen(8081, function(){
    var host = server.address().address;
    var port = server.address().port;
    console.log("应用实例，访问地址为：http://%s:%s",host,port);
})
