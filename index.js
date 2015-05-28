module.exports = function (config) {
    var module = {};
    
    //Require
	module.config = require('./config')(config);
    module.functions = require('./functions')(module.config);
    module.express = require('./express')(module.config, module.functions);
	if (module.config.tcp.listen != ''){ module.tcp = require('./tcp')(module.config, module.functions); }
	if (module.config.udp.listen != ''){ module.udp = require('./udp')(module.config, module.functions); }

    return module;
};