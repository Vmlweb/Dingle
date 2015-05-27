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
	if (config.http.listen != ''){
		http.createServer(app).listen(config.http.port, config.http.listen);
		console.log('HTTP listening at ' + config.http.listen + ':' + config.http.port);
	}
	
	//HTTPS
	if (config.https.listen != ''){
		https.createServer({
			key: fs.readFileSync(config.https.ssl.key),
			cert: fs.readFileSync(config.https.ssl.cert)
		}, app).listen(config.https.port, config.https.listen);
		console.log('HTTPS listening at ' + config.https.listen + ':' + config.https.port);
	}
	
    return app;
};