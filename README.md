# Dingle
Dingle is a quick and easy NodeJS framework which can be used to create scalable and maintainable API layouts.

## Installation

```bash
$ npm install --save dingle
```

## Features

	* HTTP and HTTPS
	* JSON output
	* Parameter validation
	* File uploads
	* Execute functions
	* Based on ExpressJS

## Startup

To start dingle it requires a minimum of a hostname to listen on:

```javascript
var dingle = require('dingle')({ http_hostname: '0.0.0.0' });
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

We can then execute these functions via a chosen protocol:

```
https://myawesomeapi.com/users_forgot_username/
```

See more below about accessing functions in each protocol.

## Function Layout

The module for each function is laid out as follows:

- `module.method` - Methods available: *GET, PUT, DELETE, POST*
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
 
    module.execute = function(res, req, params, respond){
        
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
				respond(res, req, true,'Registration Complete',{
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
respond(res, req, success, message, output);
```

## Parameter Layout

Dingle will handle parameter validation for you and can be specified like so:

- `validate` - Validation types available, see below.
- `required` - Whether the value can be blank.
- `description` - Parameters use in a sentance.
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

You can use built in valiation types which are based on the validator module:

```javascript
type.string
type.bool
type.float
type.int
type.date //Returns a javascript date object
type.file //Can only be used in POST method with multipart requests, see below

type.email
type.ip
type.url
type.base64
type.mongo //MongoDB object id
type.card //Credit or debit card
```

## File Uploads

When using type.file the following Multer object is returned in the params property:

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

## Adding Custom Types

Custom data types can be added and applied to dingle like so:

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

- The parameter is passed into the function as a string.
- Perform the necessary validation and throw an Error() should there be any invalidity.
- Once the data has been validated it must be returned in the correct data type.

## Additional Options

There are further options which can be used as follows:

```javascript
var dingle = require('dingle')({
	
	//Paths
	path_functions: './public', //Path storing functions
	
	//App (Default from package.json)
	app_name: 'My Awesome App',
	app_prefix; 'MAA',
	app_version: '0.0.2',
	
	//HTTP
	http_hostname: '127.0.0.1',
	http_port: 80,
	
	//HTTPS
	https_hostname: '127.0.0.1',
	https_port: = 443,
	https_ssl_key: './key.pem',
	https_ssl_cert: './cert.pem',
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
module.execute = function(res, req, params, respond){

    execute(config, req, function(success, message, output){
	    
	    if (success){
			respond(res, req, true,'Success result from users_forgot_username', output);
		}else{
			respond(res, req, true,'Error result from users_forgot_username', message);
		}
	
	}, params, 'users_forgot_username');
}
```

We can even execute a function from outside dingle:

```javascript
var dingle = require('dingle')({ http_hostname: '0.0.0.0' });

dingle.execute(dingle.config, {}, function(success, message, output){
    console.log(success);
    console.log(message);
    console.log(output);
},{
	email: 'admin@myawesomeapi.com'
}, 'users_forgot_username');
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
	console.log(call.name + ' ' + call.module.method);
}
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