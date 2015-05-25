module.exports = function (config) {
    var module = {};
    var pack = require('./package.json');
    
	//App
	module.app = {};
	module.app.name = config.app_name || pack.name;
	module.app.prefix = config.app_prefix || pack.name.substring(0,3).toUpperCase();
	module.app.version = config.app_version || pack.version;
	
	//HTTP
	module.http = {}
	module.http.hostname = config.http_hostname || '';
	module.http.port = config.http_port || 80;
	
	//HTTPS
	module.https = {}
	module.https.hostname = config.https_hostname || '';
	module.https.port = config.https_port || 443;
	module.https.ssl = {}
	module.https.ssl.key = config.https_ssl_key || 'key.pem'
	module.https.ssl.cert = config.https_ssl_cert || 'cert.pem';
	
	//TCP
	module.tcp = {}
	module.tcp.hostname = config.tcp_hostname || '';
	module.tcp.port = config.tcp_port || 7691;
	
	//UDP
	module.udp = {}
	module.udp.hostname = config.udp_hostname || '';
	module.udp.port = config.udp_port || 7692;
	
	//Misc
	module.reload = config.reload || false;
	module.path = config.path || "./public";
	module.methods = [
		'GET',
		'PUT',
		'POST',
		'DELETE',
		'TCP',
		'UDP'
	]

    return module;
};