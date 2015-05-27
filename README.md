# Dingle
Dingle is a quick and easy NodeJS framework which can be used to create scalable and maintainable API layouts.

## Installation

```bash
$ npm install --save dingle
```

## Features

	* HTTP and HTTPS
	* TCP and UDP
	* JSON output
	* Client code generation
	* Parameter validation
	* File uploads
	* Execute functions
	* Based on ExpressJS

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

To access the functions via `HTTP or HTTPS` we use the URL.

```
https://myawesomeapi.com/users_forgot_username/
```

For `GET, PUT and DELETE` requests use url encoded parameters to supply data to the function like so:

```
https://myawesomeapi.com/users_forgot_username/?email=admin@myawesomeapi.com&password=myawesomeapi.com
```

For `POST` requests the url encoded data must be attached to the multipart body of the request.

## TCP & UDP

To access the functions via `TCP or UDP` you must first make a connection using either protocol and send data using the following format:

```
/users_forgot_username/email=email=admin@myawesomeapi.com&password=myawesomeapi.com
```

You will then receive a response containing the output data.

## Function Layout

The module for each function is laid out as follows:

- `module.method` - Methods available: `GET, PUT, DELETE, POST, TCP, UDP`
- `module.name` - Function in a few words.
- `module.description` - Function in a few more words.
- `module.params` - List of parameters the function requires. (Will be validated and passed to module.execute)
- `module.execute` - Perform main script of the function and provide responce.

```javascript
module.exports = function (type, functions, execute, config) {
    var module = {};
    
    module.method = 'GET';
    module.name = "Register Users";
    module.description = "Use this function to create a user in the MongoDB database before they are given access to the website";
 
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
 
    module.execute = function(req, res, params, respond){
        
        //Create User
		var user = new NewUser({
			email: params.email,
			password: params.password
		});
	
		//Save User to MongoDB
		user.save(function (error){
			if (error){
				respond(req, res, false,'Registration Failed:' + error,{});
			}else{
				respond(req, res, true,'Registration Complete',{
					user: user._id
				});	
			}
		});
    }
 
    return module;
};
```

Once the task has completed inside module.execute you must use the respond callback.

```javascript
respond(req, res, success, message, output);
```

## Parameter Layout

Dingle will handle parameter validation for you and can be specified like so:

- `validate` - Validation types available, see below.
- `required` - Whether the value can be blank.
- `description` - Parameters use in a sentence.
- `error` - Error message which is presented if the parameter failed validation.

```javascript
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
```

You can use built in validation types which are based on the validator module:

- `string`
- `bool`
- `float`
- `int`
- `date` - Returns a javascript date object
- `file` - Can only be used in POST method with multipart requests, see below
- `email`
- `originalname`
- `ip`
- `url`
- `base64`
- `mongo` - MongoDB object id
- `card` - Credit or debit card

## Custom Types

Custom data types can be added and used in parameter validation like so:

```javascript
var validator = require('validator');

var dingle = require('dingle')({
	http_listen: '0.0.0.0',
	https_listen: '0.0.0.0',
	tcp_listen: '0.0.0.0',
	udp_listen: '0.0.0.0'
});

dingle.type.date = function(string){
	
	//Check for validity
	if (!validator.isDate(string)){
		throw new Error();
	}
	
	//Return sanitized result
	return validator.toDate(string);
}
```

- The parameter is passed into the function as a string.
- Perform the necessary validation and throw an Error() should there be any invalidity.
- Once the data has been validated it must be returned in the correct data type.

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

## File Downloads

When using `HTTP or HTTPS` files can be downloaded from a function using the express response object like so:

```javascript
module.execute = function(req, res, params, respond){    
	
		var file = './uploads/' + params.file;
		
		fs.exists(file, function (exists){
			if (exists){
				res.download(file, 'download.zip');
			}else{
				respond(req, res, false,'File could not be found',{});
			}	
		});
	    
	}
```

When downloading a file no status or message can be supplied and so res.download and respond should not be used one after another.

## Additional Options

There are further options which can be used as follows:

```javascript
var dingle = require('dingle')({
	
	//Paths
	path_functions: './public', //Path storing functions
	path_exports: './export', //Path to build client code into
	
	//App (Default from package.json)
	app_name: 'My Awesome App',
	app_prefix; 'MAA',
	app_version: '0.0.7',
	
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

## Executing Functions

You can execute functions from within a function like so:

```javascript
execute(config, req, function(success, message, output){
	console.log(output);
}, params, function);
```

For example to execute the `users_forgot_username` function we can use the following:

```javascript
module.execute = function(req, res, params, respond){

    execute(config, req, function(success, message, output){
	    
	    if (success){
			respond(req, res, true,'Success result from users_forgot_username', output);
		}else{
			respond(req, res, true,'Error result from users_forgot_username', message);
		}
	
	}, params, 'users_forgot_username');
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

dingle.execute(dingle.config, {}, function(success, message, output){
    console.log(success);
    console.log(message);
    console.log(output);
},{
	email: 'admin@myawesomeapi.com'
}, 'users_forgot_username');
```

## Code Generation

You can use the following call to generate client side code or frameworks based on the functions in dingle.
Each generator is stored in a module and must be installed before use.
Then simply specify the module name as a string to build the files like so:

```javascript
var dingle = require('dingle')({
	http_listen: '0.0.0.0',
	https_listen: '0.0.0.0',
	tcp_listen: '0.0.0.0',
	udp_listen: '0.0.0.0'
});

dingle.generate('my-generation-module');
```

The official generation modules are listed below and must be npm installed before hand:

  * [Swift Alamofire](https://github.com/Vmlweb/Dingle-Swift-Alamofire)
	
## Custom Code Generators

You can also create your own code generator module for languages which you require with the following layout:

- `methods` - Array of methods this module can export.
- `setup` - Executed once when generation begins.
- `generate` - Executed once per function.

```javascript
module.exports.methods = [ "GET", "PUT", "DELETE", "POST" ];

//Setup
module.exports.setup = function(config, type, dir, functions){

}
	
//Each Call
module.exports.generate = function(config, type, dir, func, hostname){

}
```

- `dir` - Working directory where files should be created.
- `func` - Object containing information for a function.
- `functions` - List of all func objects.
- `hostname` - URL to access the server, including protocol, paths and function names.

## Customization

You can access internal modules dingle uses to run to gain more functionality using the following properties:

- `config` - Startup configuration for dingle.
- `calls` - Object with dingle function information.
- `type` - Object with parameter validation types.
- `express` - Express app instance.
- `router` - Express request router.
- `tcp` - Standard net TCP sever.
- `udp` - Socket for UDP server.

You can access information relating to the API calls loaded:

```javascript
var dingle = require('dingle')({
	http_listen: '0.0.0.0',
	https_listen: '0.0.0.0',
	tcp_listen: '0.0.0.0',
	udp_listen: '0.0.0.0'
});

dingle.calls.forEach(function(call){
	console.log(call.name + ' ' + call.module.method);
}
```

You can add additional Express middleware:

```javascript
var dingle = require('dingle')({
	http_listen: '0.0.0.0',
	https_listen: '0.0.0.0',
	tcp_listen: '0.0.0.0',
	udp_listen: '0.0.0.0'
});

dingle.express.use(function (req, res, next) {
  next();
});
```

You can create additional Express routing:

```javascript
var dingle = require('dingle')({
	http_listen: '0.0.0.0',
	https_listen: '0.0.0.0',
	tcp_listen: '0.0.0.0',
	udp_listen: '0.0.0.0'
});

dingle.router.get('/about', function(req, res) {
	res.send('About birds');
});
```