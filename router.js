var express = require('express');
var multer = require('multer');
var val = require('validator');

var execute = require('./execute');

module.exports = function (config, calls, app) {
    var module = {};
	
	//Router
	var router = express.Router({
		caseSensitive: true
	});
	
	//Calls
	calls.forEach(function(call){
		
		//Generate URL
		var url = '/' + call.name.toLowerCase() + '/';
		
		//Methods
		if (call.module.method == 'GET'){
			router.get(url, function (req, res){ execute(config, req, res, req.query, call); });
		}else if (call.module.method == 'PUT'){
			router.put(url, function (req, res){ execute(config, req, res, req.query, call); });
		}else if (call.module.method == 'DELETE'){
			router.delete(url, function (req, res){ execute(config, req, res, req.query, call); });
		}else if (call.module.method == 'POST'){
			router.post(url, [ multer(), function (req, res){
				for (file in req.files){
					req.body[file] = req.files[file];
				}
				execute(config, req, res, req.body, call);
			}]);
		}
	});
	
	//Express
	app.use(router);
	
	//Errors
	app.use(function(req, res, next){
		res.json({
			success: false,
			message: 'Function could not be found',
			output: {}
		}).status(404);
	});
	
    return router;
};