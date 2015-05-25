# Dingle
Dingle is a quick and easy NodeJS framework which can be used to manage scalable API layouts.

## Installation

```bash
$ npm install --save dingle
```

## Features

	* HTTP and HTTPS
	* JSON output
	* Parameter validation
	* File uploads
	* Based on Express

## Startup

To start dingle it requires a minimum of a hostname to listen on:

```javascript
var dingle = require('dingle')({ http_hostname: '0.0.0.0' });
```

### Additional Options

There are further options which can be used as follows:

```javascript
var dingle = require('dingle')({
	
	//Misc
	reload: true, //Are API calls reloaded before execution
	path: "./public", //Path for API calls
	
	//App
	app_name: 'My Awesome App',
	app_prefix; 'MAA',
	app_version: '0.0.2',
	
	//HTTP
	http_hostname: '0.0.0.0',
	http_port: 80,
	
	//HTTPS
	https_hostname: '0.0.0.0',
	https_port: = 443,
	https_ssl_key: './key.pem',
	https_ssl_cert: './cert.pem'
});
```

## Creating API Calls

Each API call exists in a JS file/module and is loaded by default from ./public.
The folder layout of ./public will match the URL of the rerquest.

The filename of the module determines which method will be used:

- **GET** = get.js
- **PUT** = put.js
- **DELETE** = delete.js
- **POST** = post.js

The file/module for an API call is laid out as follows:

```javascript
module.exports = function (type) {
	var module = {};
		
	module.description = "Register Users";
	module.details = "Use this function to create a user in the
	MongoDB database before they are given access to the website";

	module.params = {
		email: { 
			validate: type.email,
			required: true, 
			description:"Email for registering user ", 
			error: 'Please enter a valid email address' 
		},
		password: { 
			validate: type.string,
			required: true,
			description: "Password for registering user",
			error: 'Please enter a password'
		}
	}

	module.execute = function(res, req, params, respond){
		
		///Do Stuff!
		
		//Create User
		var user = new NewUser({
			email: params.email,
			password: params.password
		});
	
		//Save User to MongoDB
		user.save(function (error){
			if (error){
				respond(res, req, false,'Registration Failed:' + error,{});
			}else{
				respond(res, req, true,'Registration Complete',{ user: user._id });	
			}
		});
	}

	return module;
};
```

Once the required code has completed inside the execute function you must use the respond callback.

```javascript
respond(res, req, success, message, output);
```

If no respond is called then the call will hang and timeout eventually.

## Parameter Validation

The parameters for methods must be supplied in the below format:

- **GET** - URL Encoded
- **PUT** - URL Encoded
- **DELETE** - URL Encoded
- **POST** - Multipart(Files) or Form URL Encoded

There are built in types which are based on the validator module:

```javascript
type.string
type.bool
type.float
type.int
type.date //Returns a JS date object
type.file //Can only be used in POST method with multipart requests

type.email
type.ip
type.url
type.base64
type.mongo //MongoDB object id
type.card //Credit card
```

### Adding Custom Types

Custom data types can be added and applied to the API call parameters.

- The parameter is passed into the function as a string.
- Perform the necessary validation and throw an Error() should there be any invalidity.
- Once the data has been validated it must be returned in the correct data type.

For example:

```javascript
var dingle = require('dingle')({ http_hostname: '0.0.0.0' });
var validator = require('validator');

dingle.type.date = function(string){
	
	//Check for validity
	if (!validator.isDate(string)){
		throw new Error();
	}
	
	//Return sanitized result
	return validator.toDate(string);
}
```

## Customization

We can access the config options dingle is running:

```javascript
var dingle = require('dingle')({ http_hostname: '0.0.0.0' });

console.log(dingle.config);
```

We can access information relating to the API calls loaded:

```javascript
var dingle = require('dingle')({ http_hostname: '0.0.0.0' });

dingle.calls.forEach(function(call){
	console.log(call.method + ' ' + call.url);	
});
```

We can add additional Express middleware:

```javascript
var dingle = require('dingle')({ http_hostname: '0.0.0.0' });

dingle.express.use(function (req, res, next) {
  next();
});
```

We can create additional Express routing:

```javascript
var dingle = require('dingle')({ http_hostname: '0.0.0.0' });

dingle.router.get('/about', function(req, res) {
	res.send('About birds');
});
```