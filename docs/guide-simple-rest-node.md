# Guide to build a simple REST API with NodeJS and Express

## Getting started

- Make sure NodeJS and npm installed on your machine
  ```bash
  $ node -v
  $ npm -v
  ```
## Initialize App

- Create new folder
  ```bash
  $ mkdir myapp
  $ cd myapp
  $ touch server.js
  ```
- Init npm to create `package.json` file
  ```bash
  $ npm init --yes
  ```
  The yes flag is used to enter default values for all the questions asked.

  The command output:

  ```json
  "name": "myapp",
  "version": "1.0.0",
  "description": "",
  "main": "serve.js",
  "scripts": {
  "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC"
  }
  ```
- Custom scripts in `package.json` if you want to run server and client  concurrently
  ```json
    "scripts": {
      "server": "nodemon server.js",
      "start": "node server.js",
      "client": "npm start --prefix client",
      "dev": "concurrently \"npm run server\" \"npm run client\"",
      "test": "echo \"Error: no test specified\" && exit 1"
    },
  ```
- Install dependencies necessary
  ```
  $ npm i express express-validator bcryptjs config gravatar jsonwebtoken mongoose request
  $ npm i -D nodemon concurrently
  $ npm i multer morgan debug server-index
  ```

  The -D flag means install these dependencies only in this project.

## Config `server.js`

  ```javascript
  const express = require('express');
  const app = express();
  const port  = process.env.PORT || 3000;
  app.listen(port,() =>{
    console.log('Server is running on port ', port)
  })
  ```
# Running and configuring App
  ```bash
  $ nodemon server.js
  # Or
  $ npm run dev
  ```

## Dubug mode

While we are at it, let’s introduce a debug module. As you can see, the current console.log just prints a simple line. This may be acceptable for simple applications, but when you app scales, it is good to have some distinction between various logs.

Edit `server.js`

```js
const express = require('express');
const app = express();
const debug = require('debug')('myapp:server');
const port = process.env.PORT || 3000;
app.listen(port, () => {
 debug('Server is up and running on port ', port);
})
```

## Write request

```js
//server.js
const express = require('express');
const app = express();
const debug = require('debug')('myapp:server');
const path = require('path');
const multer = require('multer');
const logger = require('morgan');
const serveIndex = require('serve-index')

var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public/uploads')
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
});

//will be using this for uplading
const upload = multer({ storage: storage });

//get the router
const userRouter =require('./routes/user.route');

app.use(logger('tiny'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
//app.use(express.static('public'));
app.use('/ftp', express.static('public'), serveIndex('public', {'icons': true}));

app.get('/', function(req,res) {
    return res.send("hello from my app express server!")
})

app.post('/testUpload', upload.single('file'), function(req,res) {
    debug(req.file);
    console.log('storage location is ', req.hostname +'/' + req.file.path);
    return res.send(req.file);
})

//if end point is /users/, use the router.
app.use('/users', userRouter);

const port = process.env.PORT || 3000;
app.listen(port, () => {
    debug('Server is up and running on port ', port);
})

```
So we have implemented all 4 main methods. I have put in the comments what each of the methods does. Now we can use Postman to check all these methods work.

# Code refactoring

Go back to the main folder and do the following:

```
$ mkdir routes
$ cd routes
$ touch user.route.js
```

```js
//user.route.js
const express = require('express');
const debug = require('debug')('myapp:userrouter');

const multer = require('multer');
const path = require('path');

//set the storage destination and naming 
var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, '../public/uploads')
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
});

//will be using this for uplading
const upload = multer({ storage: storage });

//router basically acts like a mini app.
const router = express.Router();



let users = [
    {
        'id':0,
        'name': 'a',
        'age': 2
    },
    {
        'id':1,
        'name': 'b',
        'age': 3
    }
]
//all endpoints do not require /users/ anymore

router.get('/', function(req,res) {
    return res.send(users);
})

router.get('/:id', function(req,res) {
    let id = req.params.id;
    return res.send(users[id]);
})

router.post('/', function(req,res) {
    users.push(req.body);
    return res.send(users);
})

//request will first go through multer and then req.file will be available
router.post('/regsiter', upload.single('file'), function(req,res) {
    debug(req.file);
    return res.send(req.file);
})

router.put('/:index', function(req,res){
    let index = req.params.index;
    users[index] = req.body;
    return res.send(users);
})

router.delete('/last', function(req,res){
    res.send(users.pop());
})
//make it available to be used in index.js
module.exports = router;

```

And now `server.js`

```js
//server.js
const express = require('express');
const app = express();
const debug = require('debug')('myapp:server');
const path = require('path');
const multer = require('multer');
const logger = require('morgan');
const serveIndex = require('serve-index')

var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public/uploads')
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
});

//will be using this for uplading
const upload = multer({ storage: storage });

//get the router
const userRouter =require('./routes/user.route');

app.use(logger('tiny'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
//app.use(express.static('public'));
app.use('/ftp', express.static('public'), serveIndex('public', {'icons': true}));

app.get('/', function(req,res) {
    return res.send("hello from my app express server!")
})

app.post('/testUpload', upload.single('file'), function(req,res) {
    debug(req.file);
    console.log('storage location is ', req.hostname +'/' + req.file.path);
    return res.send(req.file);
})

//if end point is /users/, use the router.
app.use('/users', userRouter);

const port = process.env.PORT || 3000;
app.listen(port, () => {
    debug('Server is up and running on port ', port);
})
```