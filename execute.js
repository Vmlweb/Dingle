var express = require('express');
var val = require('validator');

var type = require('./type');
var execute = require('./execute');

module.exports = function (config, req, res, query, call) {
	var new_query = {}
	
	//Call is string
	if (!call.hasOwnProperty('module')){
		var reload = require('require-reload')(require);
		var calls = require('./calls')(config);
		
		//Import
		for (current in calls){
			current = calls[current];
			if (call == current.name){
				call = {}
				call.module = reload(current.path)(type, calls, execute, config);
			}
		}
	}
	
	//Reload
	if (config.reload && res.hasOwnProperty('app')){
		var reload = require('require-reload')(require);
		call.module = reload(call.path)(type, require('./calls')(config), execute, config);
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
	try{
		call.module.execute(req, res, new_query, respond);
	}catch(error){
		respond(req, res, false, error.message, error.stack.split('\n'));
	}
	
	//Respond
	function respond(req, res, success, message, output){
		var json = {
			success: success,
			message: message,
			output: output
		}
			
		//Output
		if (typeof res.json === 'function'){
			res.json(json);
		}else{
			res(json);
		}
	}
};