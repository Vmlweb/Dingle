var express = require('express');
var multer = require('multer');
var val = require('validator');

var execute = require('./execute');

module.exports = function (config, calls, app) {
    var module = {};
	
	//Router
	var router = express.Router();
	
	//Calls
	calls.forEach(function(call){
		
		//Methods
		if (call.method == 'GET'){
			router.get(call.url, function (req, res){ execute(config, req, res, req.query, call); });
		}else if (call.method == 'PUT'){
			router.put(call.url, function (req, res){ execute(config, req, res, req.query, call); });
		}else if (call.method == 'DELETE'){
			router.delete(call.url, function (req, res){ execute(config, req, res, req.query, call); });
		}else if (call.method == 'POST'){
			router.post(call.url, [ multer(), function (req, res){
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
		res.status(404);
		return respond(req, res, false, 'API call was not found', {});
	});
	
    return router;
};