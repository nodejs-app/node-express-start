var express = require('express');
var app = express();
var fs = require('fs');

var bodyParser = require('body-parser');

var urlencodeParser = bodyParser.urlencoded({extend: false});

var multer = require('multer');

// const sql = require('mssql');

var sql = require('seriate');

// sql.connect("mssql://sa:siteweb@009@10.169.42.95/TestNodejs").then(() => {
// 		console.log("connected");
// 	    return sql.query`select * from tt where id = ${2}`;
// 	}).then(result => {
// 	    console.log(result);
// 	}).catch(err => {
// 	    console.log(err);
// 	})

const MSSQL_CONFIG = {
    user: 'sa',
    password: 'siteweb@009',
    server: '10.169.42.95', // You can use 'localhost\\instance' to connect to named instance
    database: 'TestNodejs',

    options: {
        encrypt: true // Use this if you're on Windows Azure
    }
}

sql.setDefaultConfig(MSSQL_CONFIG);

sql.on('error', err => {
    console.log(error);
});

app.use(express.static('public'));
app.use(bodyParser.urlencoded({extend: false}));
app.use(multer({dest: './upload-dir/'}).array('images'));

//get请求
app.get('/', function(req,res){
    console.log("主页Get请求");
    sql.execute({
		query:'select * from tt where id = @id',
		params:{
			id:{
				val:1,
				type:sql.int
			}
		}
	}).then(function(data){
		data = data [0];
		if(data == undefined){
			console.log("404 NOT FOUND");
			res.send({status:'404',msg:'数据不存在'});
		}
		else{
			console.log("200 查找成功");
			res.send({status:'200',msg:'查找成功',data:data});
		}
		return;
	},function(err){
		res.send({status: '500',msg: '服务器错误'});
		return;
	});
})

//post请求
app.post('/register', urlencodeParser, function(req,res){
	var str = 1234;
	sql.execute({
		query : 'select * from tt where str = @str',
		params:{
			str:{
				val:str,
				type:sql.NVARCHAR
			}
		}
	}).then(
	function(doc){
		doc = doc[0];
		if(doc){
			console.log(doc);
			res.send({status: '404',msg: '当前用户已存在'});
			return;
		}
		else{
			sql.execute(
			{
				query:'insert into tt(id,str) values(@id,@str)',
				params:{
					id:{
						val:4,
						type:sql.int
					},
					str:{
						val:str,
						type:sql.NVARCHAR
					}
				}
			}).then(function(doc1)
			{
				res.send({status: '200',msg:'用户注册成功'});
				var msg = '用户: '+ str + '注册成功\n';
				console.log(msg);
				return;
			},function(err1){
				res.send({status: '500',msg: '用户注册失败'});
				return;
			});
		}
	},function(err){
		res.send({status: '500',msg: '服务器错误'});
		return;
	});
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

app.get('/index.html', function(req,res){
	res.sendFile(__dirname + "/" + "index.html");
})

app.get('/demo.html', function(req,res){
	res.sendFile(__dirname + "/" + "demo.html");
})

app.get('/upload.html', function(req,res){
	res.sendFile(__dirname + "/" + "upload.html");
})

app.get('/process_get', function(req,res){
	//输出json格式
	response = {
		first_name: req.query.first_name1,
		last_name: req.query.last_name1
	};
	console.log(response);
	res.end(JSON.stringify(response));
})

app.post('/process_post', urlencodeParser, function(req,res){
	//输出json格式
	response = {
		first_name: req.body.first_name,
		last_name: req.body.last_name
	};
	console.log(response);
	res.end(JSON.stringify(response));
})

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

var server = app.listen(process.env.PORT || 8080, function(){
    var host = server.address().address;
    var port = server.address().port;
    console.log("应用实例，访问地址为：http://%s:%s",host,port);
})
