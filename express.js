module.exports = function (config) {
    var module = {};
    
	//Express
	var express = require('express');
	var app = express();
	
	//Headers
	app.use(function(req,res,next){
	    res.setHeader('X-Powered-By', config.app.name);
	    next();
	});
	
    return module;
};