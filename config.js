module.exports = function (config) {
    var module = {};
    var pack = require('./package.json');
    
	//App
	module.app = {};
	module.app.name = config.app_name || pack.name;
	module.app.prefix = config.app_prefix || pack.name.substring(0,3).toUpperCase();
	module.app.version = config.app_version || pack.version;
	
	//Misc
	module.path = config.path || "./calls";
	module.methods = [
		'GET',
		'PUT',
		'UPDATE',
		'POST',
		'HEAD',
		'TCP',
		'UDP'
	]

    return module;
};