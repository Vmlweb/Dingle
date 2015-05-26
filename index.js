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

    return module;
};