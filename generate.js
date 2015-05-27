var fs = require('fs');
var wrench = require('wrench');
var path = require('path');

module.exports = function (config, type, calls, generator, name) {
	var dir = path.join(config.path.generate,name);
	
	//Remove
	wrench.rmdirSyncRecursive(dir, false);
	
	//Setup
	generator.setup(config, type, dir, calls);
	
	//Each call
	for (call in calls){
		call = calls[call];
		
		if (generator.methods.indexOf(call.module.method) > -1) {
			
			//Hostname
			var hostname = '';
			if (config.https.listen != '' && config.https.hostname != '' && (call.module.method == 'GET' || call.module.method == 'PUT' || call.module.method == 'DELETE' || call.module.method == 'POST')){
				hostname = 'https://' + path.join(config.https.hostname + ':' + config.https.port, call.name);
		
			}else if (config.http.listen != '' && config.http.hostname != '' && (call.module.method == 'GET' || call.module.method == 'PUT' || call.module.method == 'DELETE' || call.module.method == 'POST')){
				hostname = 'http://' + path.join(config.http.hostname + ':' + config.http.port, call.name);
				
			}else if (config.tcp.listen != '' && config.tcp.hostname != '' && call.module.method == 'TCP'){
				hostname = 'tcp://' + path.join(config.tcp.hostname + ':' + config.tcp.port, call.name);
				
			}else if (config.udp.listen != '' && config.udp.hostname != '' && call.module.method == 'UDP'){
				hostname = 'udp://' + path.join(config.udp.hostname + ':' + config.udp.port, call.name);
		
			}else{
				continue;
			}
			
			generator.generate(config, type, dir, call, hostname);
		}
	}
};