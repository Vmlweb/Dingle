module.exports = function (config) {
    var module = {};
    
	module.config = require('./config')(config);
	module.type = require('./type');
    module.express = require('./express')(module.config);
    module.calls = require('./calls')(module.config, module.type);
    module.router = require('./router')(module.config, module.express, module.calls);

    return module;
};