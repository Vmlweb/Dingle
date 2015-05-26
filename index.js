require('./misc');

module.exports = function (config) {
    var module = {};
        
	module.config = require('./config')(config);
	module.type = require('./type');
	module.execute = require('./execute');
    module.express = require('./express')(module.config);
    module.calls = require('./calls')(module.config);
    //module.generate = require('./generate')(module.config, module.calls);
    module.router = require('./router')(module.config, module.calls, module.express);

	//TCP
	if (module.config.tcp.hostname != ''){
		module.tcp = require('./tcp')(module.config, module.calls);
	}
	
	//UDP
	if (module.config.udp.hostname != ''){
		module.udp = require('./udp')(module.config, module.calls);
	}

    return module;
};