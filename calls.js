var fs = require('fs');
var wrench = require('wrench');
var path = require('path');
var replace = require("replaceall");
var val = require('validator');
var caps = require('change-case');

var type = require('./type');
var execute = require('./execute');

module.exports = function (config) {
    var module = [];
	
	//Get files
	files = wrench.readdirSyncRecursive(config.path.functions);
	for (file in files){
		file = path.join(config.path.functions,files[file]);
		
		//Directory
		if (fs.lstatSync(file).isDirectory()){
			continue;
		}
		
		//Check extension
		if (!val.equals(path.extname(file),'.js')){
			continue;
		}
		
		//Construct
		var call = {};
		call.path = file;
		
		//Construct name
		call.name = replace(config.path.functions,'',file);
		call.name = replace(path.extname(call.name),'',call.name);
		call.name = replace('/','_',call.name);
		if (call.name.charAt(0) == '_'){
			call.name = call.name.substring(1);
		}
		
		//Module
		call.module = require(file)(type, module, execute, config);
		if (!call.module.hasOwnProperty('method')){ call.module.method = 'GET'; }else{ call.module.method = call.module.method.toUpperCase(); }
		if (!call.module.hasOwnProperty('name')){ call.module.name = 'Function'; }
		if (!call.module.hasOwnProperty('description')){ call.module.description = 'Description'; }
		if (!call.module.hasOwnProperty('params')){ call.module.params = {}; }
		
		module.push(call);
	}
	
    return module;
};