var net = require('net');
var fs = require('fs');
var val = require('validator');
var querystring = require('querystring');

var execute = require('./execute');

module.exports = function (config, calls) {
    var module = {};
	
	//Create server
	var server = net.createServer(function(socket) {
    	socket.on('data', function(data) {
	    	
	    	//Parts
	    	var parts = data.toString().split('/');
	    	if (parts.length != 3){
		    	return;
	    	}
	    	var name = parts[1];
	    	var params = querystring.parse(val.stripLow(parts[2]));
	    	
	    	//Check method
	    	var found = false;
			for (current in calls){
				current = calls[current];
				if (name == current.name && current.module.method == 'TCP'){
					found = true;
				}
			}
			if (!found){
				name = '';
			}
	    	
	    	//Execute
	    	execute(config, {}, function(success, message, output){
	    		socket.write(JSON.stringify({success: success, message: message, output: output}));
		    }, params, name);
	    });
	    
	}).listen(config.tcp.port, config.tcp.listen);
	   console.log('TCP listening at ' + config.tcp.listen + ':' + config.tcp.port);

    return server;
};