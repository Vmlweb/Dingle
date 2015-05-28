var net = require('net');
var val = require('validator');
var query = require('querystring');
var server = require("dgram").createSocket('udp4');

module.exports = function (config, functions) {
    var module = {};
	
	//Bind
    server.bind(config.udp.port,function(){
	    try{
	   		server.addMembership(config.udp.ip);
	   		console.log('UDP listening at ' + config.udp.listen + ':' + config.udp.port);
	    }catch(error){
		    console.log('UDP listening at 0.0.0.0:' + config.udp.port);
	    }
	});
	
	//Create server
	server.on('message', function(data, info) {
		
		//Parts
    	var parts = data.toString().split('/');
    	if (parts.length != 3){
				var response = new Buffer(JSON.stringify({success: false, message: 'Function could not be found', output: {}}));
				server.send(response, 0, response.length, info.port, info.address);
	    	return;
    	}
    	var name = parts[1];
    	var params = query.parse(val.stripLow(parts[2]));
    	
    	//Find Function
		if (functions.hasOwnProperty(name)){
			var func = functions[name];
			
			//Check Methods
			if (func.methods.indexOf('TCP') != -1){
				
				//Execute Function
				func.run(params, function(success, message, output){
					var response = new Buffer(JSON.stringify({success: success, message: message, output: output}));
					server.send(response, 0, response.length, info.port, info.address);
				}, info);
			}else{
				var response = new Buffer(JSON.stringify({success: false, message: 'Function could not be found', output: {}}));
				server.send(response, 0, response.length, info.port, info.address);
			}
		}else{
			var response = new Buffer(JSON.stringify({success: false, message: 'Function could not be found', output: {}}));
			server.send(response, 0, response.length, info.port, info.address);
		}
    });

    return server;
};