/*var fs = require('fs');
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
		file = config.path.functions + '/' + files[file];
		
		//Directory
		if (fs.lstatSync(file).isDirectory()){
			continue;
		}
		
		//Check extension
		if (!val.equals(path.extname(file),'.js')){
			continue;
		}
			
		//Construct name
		var name = replace('/',' ',url);
		name = caps.pascalCase(name) + '_' + method;
		name = replace(' ','',name);
		if (name.charAt(0) == '_'){
			name = name.substring(1);
		}
		
		//Require
		var call = {}
		call.module = require(file)(type, module, execute, config);
		call.method = path.basename(file,path.extname(file)).toUpperCase();
		call.path = file;
		call.name = name;
		module.push(call);
	}

    return module;
};*/