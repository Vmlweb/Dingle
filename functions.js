var fs = require('fs');
var wrench = require('wrench');
var path = require('path');
var async = require('async');
var replace = require("replaceall");
var val = require('validator');

module.exports = function (config) {
    var module = {};
	
	//Get files
	wrench.readdirSyncRecursive(config.app.path).forEach(function (file){
		file = path.join(config.app.path,file);
		
		//Check extension
		if (!val.equals(path.extname(file),'.js')){
			return;
		}
		
		//Construct
		var call = require(file);
		call.path = file;
		
		//Construct name
		call.name = replace(config.app.path,'',file);
		call.name = replace(path.extname(call.name),'',call.name);
		call.name = replace('/','_',call.name);
		if (call.name.charAt(0) == '_'){
			call.name = call.name.substring(1);
		}
		
		//Blanks
		if (!call.hasOwnProperty('brief')){ call.brief = 'No Brief'; }
		if (!call.hasOwnProperty('description')){ call.description = 'No Description'; }
		if (!call.hasOwnProperty('methods')){ call.methods = [] }
		if (!call.hasOwnProperty('params')){ call.params = {} }
		if (!call.hasOwnProperty('execute')){
			call.execute = [];
			call.execute[0] = function(response, params, info, next){ next('Could not find execution function', response, params, info); }
		}
		
		//Param Blanks
		for (param in call.params){
			if (!call.params[param].hasOwnProperty('description')){ call.params[param].description = 'No Description'; }
			if (!call.params[param].hasOwnProperty('required')){ call.params[param].required = true; }
			if (!call.params[param].hasOwnProperty('validator')){ call.params[param].validator = function(object){ return object.toString(); } }
			if (!call.params[param].hasOwnProperty('description')){ call.params[param].description = 'No Description'; }
		}
		
		//Run Function
		call.run = function(params, callback, add){
			try{
			
				//Check required & validation
				var valid_params = {};
				for (param in call.params){
					
					//Required
					if (!params.hasOwnProperty(param)){
						if (call.params[param].required){
							throw "Please enter a " + param;
						}else{
							params[param] = '';
							continue;
						}
					}
					
					//Validate
					valid_params[param] = call.params[param].validator(params[param]);
				}
				
				//Construct info
				var add = add || {};
				var info = {};
				
				//Populate info
				info.functions = module;
				if (add.hasOwnProperty('remoteAddress')){
					info.address = add.remoteAddress;
					info.tcp = add;
				}else if (add.hasOwnProperty('address')){
					info.address = add.address;
					info.udp = add;
				}else if (add.hasOwnProperty('connection')){
					info.address = add.connection.remoteAddress;
					info.express = add;
				}else if (add != {}){
					info.other = add;
				}
				
				//Execute
				var execution = [function(next){ next(null, {message: 'Successful', output: {}}, valid_params, info, {}); }]
				async.waterfall(execution.concat(call.execute), function (error, response) {
					if (error){
						callback(false, error, response.output, response.download);
					}else{
						callback(true, response.message, response.output, response.download);
					}
				});
				
			}catch(error){
				callback(false, error, {});
			}
		}
				
		module[call.name] = call;
	});
	
    return module;
};