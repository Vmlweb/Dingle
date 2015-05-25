var express = require('express');
var multer = require('multer');
var val = require('validator');
var fs = require('fs');

module.exports = function (config, app, calls) {
    var module = {};
	
	//Router
	var router = express.Router();
	
	//Calls
	calls.forEach(function(call) {
		
		//Methods
		if (call.method == 'GET'){
			router.get(call.url, function (req, res){ process(req, res, req.query, call); });
		}else if (call.method == 'PUT'){
			router.put(call.url, function (req, res){ process(req, res, req.query, call); });
		}else if (call.method == 'DELETE'){
			router.delete(call.url, function (req, res){ process(req, res, req.query, call); });
		}else if (call.method == 'POST'){
			router.post(call.url, [ multer(), function (req, res){
				for (file in req.files){
					req.body[file] = req.files[file];
				}
				process(req, res, req.body, call);
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
	
	//Process
	function process(req, res, query, call){
		var new_query = {}
		
		//Reload
		if (config.reload){
			var reload = require('require-reload')(require);
			call.module = reload(call.path)(require('./type'));
		}
		
		//Validate
		for (param in call.module.params){
			name = param;
			param = call.module.params[name];
			
			//Check existance
			if (!query.hasOwnProperty(name)){
				query[name] = '';
			}
			
			//Required
			if (param.required && val.equals(query[name],'')){
				return respond(req, res, false, 'Please enter a ' + name, {});
			}
			
			//Validate
			if (val.equals(query[name],'')){
				new_query[name] = '';
			}else{
				try{
					new_query[name] = param.validate(query[name]);	
				}catch (error){
					return respond(req, res, false, param.error, {});
				}
			}
		}
		
		//Execute
		call.module.execute(req, res, new_query, respond);
		
		//No responce
		if (!res.headersSent){
			return respond(req, res, false, 'API call did not respond', {});
		}
	}
	
	//Responce
	function respond(req, res, success, message, output){
		var json = {
			success: success,
			message: message,
			output: output
		}
		res.json(json);
	}
	
    return router;
};