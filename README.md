[![Dingle Logo](http://vmlweb.co.uk/Images/Projects/dingle_plain.png)](https://www.npmjs.com/package/dingle)

Dingle is a quick and easy NodeJS module which can be used to create scalable and maintainable API backends.

## Installation

```bash
$ npm install --save dingle
```

## Features

  * HTTP, HTTPS, TCP & UDP
  * Parameter Validation
  * File Download & Uploads
  * JSON Input & Output
  
## Additional Modules

  * [Dingle Validator](https://github.com/Vmlweb/Dingle-Validator) - Preset list of parameter validation functions
  
  * [Dingle Swift Alamofire](https://github.com/Vmlweb/Dingle-Swift-Alamofire) - Swift + Alamofire code generator.

## Startup

To start dingle it requires a minimum of an ip to listen on:

```javascript
var dingle = require('dingle')({
	http_listen: '0.0.0.0',
	https_listen: '0.0.0.0',
	tcp_listen: '0.0.0.0',
	udp_listen: '0.0.0.0'
});
```

In dingle each API call is referred to as a **function**.

## Directory Layout

Each function exists in a module and is loaded from the public directory like so:

```
public
├───status.js
├───time.js
├───users.js
├───users
│   └───register.js
│   └───forgot_username.js
│   └───forgot_password.js
│   └───sessions
│       └───login.js
│       └───logout.js
│       └───list.js
```

Each function is referred to using a naming convention where directories are separated by underscores:

```
status
time
users
users_register
users_forgot_username
users_forgot_password
users_sessions_login
users_sessions_logout
users_sessions_list
```

Also note function names ARE case sensitive.

## HTTP & HTTPS

To access the functions via `HTTP or HTTPS` we use the URL:

```
https://myawesomeapi.com/users_forgot_username/?email=admin@myawesomeapi.com&password=myawesomeapi.com
```

## TCP & UDP

To access the functions via `TCP or UDP` you must first make a connection using either protocol and send data using the following format:

```
/users_forgot_username/email=admin@myawesomeapi.com&password=myawesomeapi.com
```

## Basic Function

The module for each function is laid out as follows:

- `exports.brief` - Function in a few words.
- `exports.description` - Function in a few more words.
- `exports.methods` - Array of methods to broadcast this function on: `TCP, UDP & HTTP Methods`
- `exports.params` - Object of parameters the function requires.
- `exports.execute` - Array of series functions to execute when the function is called upon.

```javascript
//Setup
exports.brief = "Register Users"
exports.description = "Use this function to create a user in the MongoDB database before they are given access to the website.";
exports.methods = [ "GET" ];

//Parameters
exports.params = {};
exports.params.email = {
	description: 'Email for registering user'
}
exports.params.password = {
	description: 'Password for registering user'
}

//Execution
exports.execute = [];
exports.execute[0] = function(response, params, info, next){
	
	//Create User
	var user = new NewUser({
		email: params.email,
		password: params.password
	});

	//Save User to MongoDB
	user.save(function (error){
		if (error){
			next(error, response, params, info);
		}else{
			//Add user to response
			response.output.user_id = user._id;
			
			next(null, response, params, info);
		}
	});
}
```

## Advanced Function

The parameter object layout goes like so:

- `exports.params[].description` - Parameter in a sentence.
- `exports.params[].required` - Boolean whether parameter is required. (If false and no value given parameter will be an empty string)
- `exports.params[].validator` - Function used to validate parameter. Throw an error if not valid and return object in the correct data type.

The execute object layout goes like so:

- `exports.execute[](response)` - Object containing message and output property which will be returned from the function.
- `exports.execute[](params)` - Object of validated parameters given from exports.params.
- `exports.execute[](info.address)` - Holds the users IP address of the user.
- `exports.execute[](info.functions)` - List of functions in dingle and functions to execute them. (See below)
- `exports.execute[](info.temp)` - Blank object to store temp data being passed through the functions.
- `exports.execute[](next)` - Function to call to move onto the next item in the function array. The first parameter is either null to continue executing or an error string to stop execution and return the error message.

```javascript
var validator = require('validator');

//Setup
exports.brief = "Register Users"
exports.description = "Use this function to create a user in the MongoDB database before they are given access to the website.";
exports.methods = ["GET", "POST" ,"TCP", "UDP"];

//Parameters
exports.params = {};
exports.params.email = {
	description: 'Email for registering user'
	validator: function(object){
		if (!validator.isEmail(object)){
			throw "Please enter a valid email adress";
		}else{
			return object.toString();
		}
	}
}
exports.params.password = {
	description: 'Password for registering user'
}
exports.params.news = {
	description: 'Password for registering user',
	required: false,
	validator: function(object){
		if (!validator.isBoolean(object)){
			throw "Please enter true or false for news";
		}else{
			return object.toBoolean();
		}
	}
}

//Execution
exports.execute = [];
exports.execute[0] = function(response, params, info, next){
	
	//Create User
	info.temp.user = new NewUser({
		email: params.email,
		password: params.password
	});

	//Add user to response
	response.output.user_id = user._id;
	
	next(null, response, params, info);
}
exports.execute[1] = function(response, params, info, next){
	
	//Save User to MongoDB
	info.temp.user.save(function (error){
		if (error){
			next(error, response, params, info);
		}else{
			next(null, response, params, info);
		}
	});
}
```

## Executing Functions

You can execute functions from within another function using the info.functions object like so:

```javascript
exports.execute[0] = function(response, params, info, next){
	
	info.functions['users_forgot_username'].run(params, function(success, message, output){
		
		//Collect result from function
		response.message = message;
		response.output = output;
		
		//Respond with result
		if (success){
			next(null, response, params, info);
		}else{
			next(message, response, params, info);
		}
		
	});
}
```

We can even execute a function from outside dingle:

```javascript
var dingle = require('dingle')({
	http_listen: '0.0.0.0',
	https_listen: '0.0.0.0',
	tcp_listen: '0.0.0.0',
	udp_listen: '0.0.0.0'
});

dingle.functions['users_forgot_username'].run({
	email: 'admin@myawesomeapi.com',
	password: 'myawesomepassword',
}, function(success, message, output){
	console.log(success);
	console.log(message);
	console.log(output);
});
```

## File Downloads

When using `HTTP or HTTPS` files can be downloaded from a function using the download property like so:

```javascript
exports.execute[0] = function(response, params, info, next){
	
	//Download README.md
	response.download = './README.md';
	
	next(null, response, params, info);
}
```

When downloading a file the message and output properties of the response object will not be displayed.

## File Uploads

When uploading files using the `POST` method the following Multer object is returned in the params property:

- `fieldname` - Field name specified in the form.
- `originalname` - Name of the file on the user's computer.
- `name` - Renamed file name.
- `encoding` - Encoding type of the file.
- `mimetype` - Mime type of the file.
- `path` - Location of the uploaded file.
- `extension` - Extension of the file.
- `size` - Size of the file in bytes.
- `truncated` - If the file was truncated due to size limitation.
- `buffer` - Raw data (is null unless the inMemory option is true).

It's your job to manipulate, read and clean up when finished.

## Additional Options

There are further options which can be used as follows:

- `app_name` - Long name of your app.
- `app_prefix` - Abbreviation which are used for exports when compiling code.
- `app_version` - Version of your app.
- `path_functions` - Default path for all functions.
- `path_downloads` - Default path for download files.
- `path_uploads` - Default path for upload files.
- `*_hostname` - Publicly accessible hostname or IP.
- `*_listen` - Local hostname or IP to listen on.
- `*_port` - Port to listen at.

```javascript
var dingle = require('dingle')({
	
	//App (Default from package.json)
	app_name: 'My Awesome App',
	app_prefix; 'MAA',
	app_version: '0.0.7',
	
	//Paths
	path_functions: './public',
	path_downloads: './downloads',
	path_uploads: './uploads',
	
	//HTTP
	http_hostname: 'myawesomeapi.com',
	http_listen: '0.0.0.0',
	http_port: 80,
	
	//HTTPS
	https_hostname: 'myawesomeapi.com',
	https_listen: '0.0.0.0',
	https_port: = 443,
	https_ssl_key: './key.pem',
	https_ssl_cert: './cert.pem',
	
	//TCP
	tcp_hostname: 'myawesomeapi.com',
	tcp_listen: '0.0.0.0',
	tcp_port: = 7691,
	
	//UDP
	udp_hostname: 'myawesomeapi.com',
	udp_listen: '0.0.0.0',
	udp_port: = 7692
});
```

## Customization

You can access internal modules dingle uses to run to gain more functionality using the following properties:

- `config` - Startup configuration for dingle.
- `functions` - Object with function information.
- `express` - Express app instance.
- `tcp` - Standard net TCP sever.
- `udp` - Socket for UDP server.

```javascript
var dingle = require('dingle')({
	http_listen: '0.0.0.0',
	https_listen: '0.0.0.0',
	tcp_listen: '0.0.0.0',
	udp_listen: '0.0.0.0'
});

console.log(dingle.functions);
```