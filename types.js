var val = require('validator');

module.exports.string = function(name, string, required, error){
	//Required
	if (required && val.equals(string,'')){
		error('Please enter a ' + name);
	}
	
	return val.toString(string);
}

module.exports.email = function(name, string, required, error){
	//Required
	if (required && val.equals(string,'')){
		error('Please enter a ' + name);
	}
	
	//Validate
	if (!val.isEmail(string)){
		error('Please enter a valid email address');
	}
	
	return val.toString(string);
}