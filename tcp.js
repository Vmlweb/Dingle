var net = require('net');
var val = require('validator');
var query = require('querystring');

module.exports = function (config, functions) {
    var module = {};
	
	//Create server
	var server = net.createServer(function(socket) {
    	socket.on('data', function(data) {
	    	
	    	//Parts
	    	var parts = data.toString().split('/');
	    	if (parts.length != 3){
		    	socket.write(JSON.stringify({success: false, message: 'Invalid message format', output: {}}));
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
						socket.write(JSON.stringify({success: success, message: message, output: output}));
					}, socket);
				}else{
					socket.write(JSON.stringify({success: false, message: 'Function could not be found', output: {}}));
				}
			}else{
				socket.write(JSON.stringify({success: false, message: 'Function could not be found', output: {}}));
			}
	    });
	    
	}).listen(config.tcp.port, config.tcp.listen);
	   console.log('TCP listening at ' + config.tcp.listen + ':' + config.tcp.port);

    return server;
};