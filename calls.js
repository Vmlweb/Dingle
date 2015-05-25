var fs = require('fs');
var wrench = require('wrench');
var path = require('path');
var replace = require("replaceall");
var val = require('validator');
var caps = require('change-case');

module.exports = function (config, types) {
    var module = [];
	
	//Get files
	files = wrench.readdirSyncRecursive(config.path);
	for (file in files){
		file = config.path + '/' + files[file];
		
		//Directory
		if (fs.lstatSync(file).isDirectory()){
			continue;
		}
		
		//Get parts
		var ext = path.extname(file);
		var method = path.basename(file,ext).toUpperCase();
		var dir = path.dirname(file);
		var url = replace(config.path,'',dir) + '/';
		
		//Construct name
		var name = replace('/',' ',url);
		name = caps.pascalCase(name) + '_' + method;
		name = replace(' ','',name);
		
		//Check extension
		if (!val.equals(ext,'.js')){
			continue;
		}
		
		//Check method
		if (config.methods.indexOf(method) <= -1){
			continue;
		}
		
		//Require
		var call = {}
		call.module = require(file)(types);
		call.method = method;
		call.url = url;
		call.path = file;
		call.name = name;
		module.push(call);
	}

	console.log(module);

    return module;
};