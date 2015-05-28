var dingle = require('./index')({
	//HTTP
	http_hostname: 'vmlweb.co.uk',
	http_listen: '0.0.0.0',
	http_port: 7691,
	//HTTPS
	https_hostname: 'vmlweb.co.uk',
	https_listen: '0.0.0.0',
	https_port: 7692,
	//TCP
	tcp_hostname: 'vmlweb.co.uk',
	tcp_listen: '0.0.0.0',
	tcp_port: 7693,
	//UDP
	udp_hostname: 'vmlweb.co.uk',
	udp_listen: '0.0.0.0',
	udp_port: 7694
});