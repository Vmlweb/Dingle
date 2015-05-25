var val = require('validator');
var fs = require('fs');
var path = require('path');

module.exports.string = function(string){
	return val.toString(string);
}
module.exports.bool = function(string){
	if (!val.isBoolean(string)){
		throw new Error();
	}
	return val.toBoolean(string);
}
module.exports.float = function(string){
	if (!val.isFloat(string)){
		throw new Error();
	}
	return val.toFloat(string);
}
module.exports.int = function(string){
	if (!val.isInt(string)){
		throw new Error();
	}
	return val.toInt(string);
}
module.exports.card = function(string){
	if (!val.isDate(string)){
		throw new Error();
	}
	return val.toDate(string);
}

module.exports.file = function(object){
	if (!object.hasOwnProperty('path')){
		throw new Error();
	}
	if (object.size == 0){
		throw new Error();
	}
	
	return object;
}

module.exports.ip = function(string){
	if (!val.isIP(string)){
		throw new Error();
	}
	return val.toString(string);
}
module.exports.mongo = function(string){
	if (!val.isMongoId(string)){
		throw new Error();
	}
	return val.toString(string);
}
module.exports.url = function(string){
	if (!val.isURL(string)){
		throw new Error();
	}
	return val.toString(string);
}
module.exports.base64 = function(string){
	if (!val.isBase64(string)){
		throw new Error();
	}
	return val.toString(string);
}
module.exports.card = function(string){
	if (!val.isCreditCard(string)){
		throw new Error();
	}
	return val.toString(string);
}
module.exports.email = function(string){
	if (!val.isEmail(string)){
		throw new Error();
	}
	return val.toString(string);
}