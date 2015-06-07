var express = require('express');
var redbird = require('redbird');
var Auth = require('./auth').Auth;

var APP_ID = 'MY_APP_ID';
var APP_TOKEN = 'MY_APP_TOKEN';

var auth = new Auth(APP_ID, APP_TOKEN);
var app = express();

app.get('/', function(req, res){
	res.sendFile( __dirname + '/test.html' )
})

app.get('/token', function(req, res) {
	auth.authenticate(function(token){
		res.status(200).json({
			session_token: token 
		})
	})	
})

app.listen(4243)

var proxy = redbird({port: 4242, bunyan: false});

proxy.register("localhost", "http://localhost:4243");
proxy.register("localhost/api", "http://mafreebox.free.fr/api/");