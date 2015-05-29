var express = require('express');
var parser = require('body-parser');
var multer = require('multer'); 
var https = require('https');
var http = require('http');
var fs = require('fs');
var merge = require('merge');
var val = require('validator');
var path = require('path');

module.exports = function (config, functions) {
    var module = {};

	//Express
	var app = express();
	
	//Middleware
	app.use(parser.json());
	app.use(parser.urlencoded({ extended: true }));
	app.use(multer({ dest: config.path.uploads}))
	app.set('case sensitive routing', true);
	app.set('trust proxy', false);
	
	//Headers
	app.use(function(req,res,next){
	    res.setHeader('X-Powered-By', 'Dingle');
	    next();
	});
	
	//Errors
	app.all('/',function(req, res, next){
		res.status(404).json({ success: false, message: 'Function could not be found', output: {} });
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
	
	//Function
	app.all('/:function/', function(req, res, next) {
		
		//Parameters
		var params = merge.recursive(req.query, req.body, req.files);
		
		//Find Function
		if (functions.hasOwnProperty(req.params.function)){
			var func = functions[req.params.function];
			
			//Check Methods
			if (func.methods.indexOf(req.method) != -1){
				
				//Execute Function
				func.run(params, function(success, message, output, download){
					if (success){
						if (download){
							download = path.join(config.path.downloads,download);
							fs.exists(download, function(exists){
								if (exists){
									res.status(200).download(download);
								}else{
									res.status(200).json({ success: success, message: message, output: output });
									next();
								}
							});
						}else{
							res.status(200).json({ success: success, message: message, output: output });
							next();
						}
					}else{
						res.status(500).json({ success: success, message: message, output: output });
						next();
					}
				}, req);
			}else{
				res.status(404).json({ success: false, message: 'Function could not be found', output: {} });
				next();
			}
		}else{
			res.status(404).json({ success: false, message: 'Function could not be found', output: {} });
			next();
		}
	});
	
    return app;
};