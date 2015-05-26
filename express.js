var express = require('express');
var parser = require('body-parser');
var multer = require('multer'); 
var https = require('https');
var http = require('http');
var fs = require('fs');

module.exports = function (config) {
    var module = {};
	
	//Express
	var app = express();
	
	//Middleware
	app.use(parser.json());
	app.use(parser.urlencoded({ extended: true }));
	app.use(multer());
	app.set('case sensitive routing', true);
	
	//Headers
	app.use(function(req,res,next){
	    res.setHeader('X-Powered-By', config.app.name);
	    next();
	});

	//HTTP
	if (config.http.hostname != ''){
		http.createServer(app).listen(config.http.port, config.http.hostname);
	}
	
	//HTTPS
	if (config.https.hostname != ''){
		https.createServer({
			key: fs.readFileSync(config.https.ssl.key),
			cert: fs.readFileSync(config.https.ssl.cert)
		}, app).listen(config.https.port, config.https.hostname);
	}
	
    return app;
};