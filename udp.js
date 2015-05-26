var val = require('validator');
var querystring = require('querystring');

var execute = require('./execute');

module.exports = function (config, calls) {
    var module = {};
	
	var server = require("dgram").createSocket('udp4');
	
	//Bind
    server.bind(config.udp.port,function(){
	    try{
	   		server.addMembership(config.udp.hostname);
	    }catch(error){
		    
	    }
	});
	
	//Create server
	server.on('message', function(data, info) {
		
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
			if (name == current.name && current.module.method == 'UDP'){
				found = true;
			}
		}
		if (!found){
			name = '';
		}
    	
    	//Execute
    	execute(config, {}, function(success, message, output){
	    	
	    	//Response
	    	var result = new Buffer(JSON.stringify({success: success, message: message, output: output}));
	    	server.send(result, 0, result.length, info.port, info.address);
			
	    }, params, name);
    });

    return server;
};