require('./misc');

module.exports = function (config) {
    var module = {};
        	
	module.config = require('./config')(config);
	module.type = require('./type');
	module.execute = require('./execute');
    
    module.express = require('./express')(module.config);
    module.calls = require('./calls')(module.config);
    module.router = require('./router')(module.config, module.calls, module.express);

	//Generate
    module.generate = function (generator){
		require('./generate')(module.config, module.type, module.calls, generator);   
    }

	//TCP
	if (module.config.tcp.listen != ''){
		module.tcp = require('./tcp')(module.config, module.calls);
	}
	
	//UDP
	if (module.config.udp.listen != ''){
		module.udp = require('./udp')(module.config, module.calls);
	}

    return module;
};