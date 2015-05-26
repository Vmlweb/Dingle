var express = require('express');
var val = require('validator');

var type = require('./type');
var execute = require('./execute');

module.exports = function (config, req, res, query, call) {
	var calls = require('./calls')(config);
	var new_query = {}
	
	//Call is string
	if (!call.hasOwnProperty('module')){

		//Search for module
		for (current in calls){
			current = calls[current];
			if (call == current.name){
				call = current
			}
		}
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
		//Construct
		var json = {
			success: success,
			message: message,
			output: output
		}
			
		//Output
		if (typeof res.json === 'function'){
			if (!res.headersSent){
				res.json(json);
			}
		}else{
			res(json.success, json.message, json.output);
		}
	}
};