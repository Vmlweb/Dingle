module.exports = function (config) {
    var module = {};
    var pack = require('./package.json');
	var replace = require("replaceall");
	var path = require('path');
	
	//App
	module.app = {};
	module.app.name = config.app_name || pack.name;
	module.app.prefix = config.app_prefix || pack.name.substring(0,3).toUpperCase();
	module.app.version = config.app_version || pack.version;
	
	//Paths
	module.path = {};
	module.path.functions = config.path_functions || "./public";
	module.path.functions = path.join(process.cwd(), module.path.functions);
	module.path.generate = config.path_exports || "./export";
	module.path.generate = path.join(process.cwd(), module.path.generate);
	
	//HTTP
	module.http = {};
	module.http.hostname = config.http_hostname || '';
	module.http.listen = config.http_listen || '';
	module.http.port = config.http_port || 80;
	
	//HTTPS
	module.https = {};
	module.https.hostname = config.https_hostname || '';
	module.https.listen = config.https_listen || '';
	module.https.port = config.https_port || 443;
	module.https.ssl = {}
	module.https.ssl.key = config.https_ssl_key || './key.pem'
	module.https.ssl.key = path.join(process.cwd(), module.https.ssl.key);
	module.https.ssl.cert = config.https_ssl_cert || './cert.pem';
	module.https.ssl.cert = path.join(process.cwd(), module.https.ssl.cert);
	
	//TCP
	module.tcp = {};
	module.tcp.hostname = config.tcp_hostname || '';
	module.tcp.listen = config.tcp_listen || '';
	module.tcp.port = config.tcp_port || 7691;
	
	//UDP
	module.udp = {};
	module.udp.hostname = config.udp_hostname || '';
	module.udp.listen = config.udp_listen || '';
	module.udp.port = config.udp_port || 7692;
	
    return module;
};