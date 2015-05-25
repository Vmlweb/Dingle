module.exports = function (config) {
    var module = {};
    
	module.config = require('./config')(config);
	module.types = require('./types');
    module.express = require('./express')(module.config);
    module.calls = require('./calls')(module.config, module.types);
    module.router = require('./router')(module.config, module.calls);

    return module;
};