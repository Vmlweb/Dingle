module.exports = function (config) {
    var module = {};
    var pack = require('./package.json');
	var replace = require("replaceall");
    
	//App
	module.app = {};
	module.app.name = config.app_name || pack.name;
	module.app.prefix = config.app_prefix || pack.name.substring(0,3).toUpperCase();
	module.app.version = config.app_version || pack.version;
	
	//Paths
	module.path = {};
	module.path.functions = config.path_functions || "./public";
	module.path.functions = replace('/./','/',process.cwd() + '/' +  module.path.functions);
	
	//HTTP
	module.http = {}
	module.http.hostname = config.http_hostname || '';
	module.http.port = config.http_port || 80;
	
	//HTTPS
	module.https = {}
	module.https.hostname = config.https_hostname || '';
	module.https.port = config.https_port || 443;
	module.https.ssl = {}
	module.https.ssl.key = config.https_ssl_key || './key.pem'
	module.https.ssl.key = process.cwd() + '/' +  module.https.ssl.key;
	module.https.ssl.cert = config.https_ssl_cert || './cert.pem';
	module.https.ssl.cert = process.cwd() + '/' +  module.https.ssl.cert;
	
	//TCP
	module.tcp = {}
	module.tcp.hostname = config.tcp_hostname || '';
	module.tcp.port = config.tcp_port || 7691;
	
	//UDP
	module.udp = {}
	module.udp.hostname = config.udp_hostname || '';
	module.udp.port = config.udp_port || 7692;
	
    return module;
};