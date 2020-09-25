# Build dev-connector REST API with NodeJS and Express


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
  ```

  The -D flag means install these dependencies only in this project.

## Config `server.js`(Init version)
- Config `server.js` without mongodb, to make sure server can run properly on port 5000
  ```js
  const express = require('express');

  const app = express();

  //Init Middleware
  app.use(express.json({ extends: false }));

  // Root path of project
  app.get('/', (req, res) => res.send('API running'));

  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
  });

  ```

  Your app will run on port `localhost:5000` 

# Config database with MongoDB

- Create folder `config` and `db.js`
  ```bash
  $ mkdir config
  $ touch db.js
  ```
- Config db.js
  ```js
  const mongoose = require('mongoose');
  const dotenv = require('dotenv');
  dotenv.config();
  const db = process.env.MONGO_URI;

  const connectDB = async () => {
    try {
      await mongoose.connect(db, {
        useFindAndModify: false,
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
      });
      console.log('MongoDB has been connected');
    } catch (err) {
      console.log(err.message);

      //Exit process with failure
      process.exit(1);
    }
  };

  module.exports = connectDB;

  ```

  In your .env file, you give a link of your mongodb atlas
  For ex: 
  ```
  MONGO_URI=mongodb+srv://<your-user-name>:<your-password>@cluster0-g9pfv.mongodb.net/<dbname>?retryWrites=true&w=**majority**
  ```
- Connect your app to MongoDB
  
  In `server.js`:

  ```js
  //server.js
  //Connect database
  connectDB();
  ```
## Route with Express Router

- Create folder `routes`and api files necessary
  ```bash
  $ mkdir routes
  $ mkdir routes/api
  $ cd routes/api
  $ touch auth.js posts.js profile.js users.js
  ```

  In the api/<file>.js, we will put all the api methods that we need for our app
- Add routes to `server.js`
  ```js
  const express = require('express');
  const connectDB = require('./config/db');

  const app = express();

  //Connect database
  connectDB();

  //Init Middleware
  app.use(express.json({ extends: false }));

  // Root path of project
  app.get('/', (req, res) => res.send('API running'));

  //Define routes
  app.use('/api/users', require('./routes/api/users'));
  app.use('/api/auth', require('./routes/api/auth'));
  app.use('/api/profile', require('./routes/api/profile'));
  app.use('/api/posts', require('./routes/api/posts'));

  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
  });

  ```
## Using JWT for authentication
- Create folder `middleware` and `auth.js` file
  ```bash
  $ mkdir middleware
  $ touch auth.js
  ```
- Write `auth.js` file with JWT
  ```js
  const jwt = require('jsonwebtoken');
  const dotenv = require('dotenv');
  dotenv.config();

  module.exports = function (req, res, next) {
    //Get token from header
    const token = req.header('x-auth-token');

    //Check if not token
    if (!token) {
      return res.status(401).json({
        msg: 'No token, authorization denied',
      });
    }

    //Verify token
    const jwtSecret = process.env.jwtSecret;
    try {
      const decoded = jwt.verify(token, jwtSecret);

      req.user = decoded.user;
      next();
    } catch (err) {
      res.status(401).json({ msg: 'Token is not valid' });
    }
  };

  ```
  For JWT config, you put an variable `jwtSecret` for your key of secret. You can't put whatever key you want

  For ex: 
  ```
  jwtSecret=whateveryouwant
  ```

  This authentication will use as a middleware in all the route that we want to protect.

## Create models for MongoDB
- Create folder `models` and model.js file
  ```
  $ mkdir models
  $ cd models
  $ touch Posts.js Profile.js User.js
  ```

- User model
  ```js
  const mongoose = require('mongoose');
  const Schema = mongoose.Schema;

  const UserSchema = new Schema({
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
    },
    date: {
      type: Date,
      default: Date.now,
    },
  });

  module.exports = mongoose.model('user', UserSchema);

  ```

- Post model
  ```js
  const mongoose = require('mongoose');
  const Schema = mongoose.Schema;

  const PostSchema = new Schema({
    user: {
      type: Schema.Types.ObjectId,
      ref: 'user',
    },
    text: {
      type: String,
      required: true,
    },
    name: {
      type: String,
    },
    avatar: {
      type: String,
    },
    likes: [
      {
        user: {
          type: Schema.Types.ObjectId,
          ref: 'user',
        },
      },
    ],
    comments: [
      {
        user: {
          type: Schema.Types.ObjectId,
          ref: 'user',
        },
        text: {
          type: String,
          required: true,
        },
        name: {
          type: String,
        },
        avatar: {
          type: String,
        },
        date: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  });

  module.exports = Post = mongoose.model('post', PostSchema);

  ```
- Profile model
  ```js
  const mongoose = require('mongoose');
  const Schema = mongoose.Schema;

  // Create Schema
  const ProfileSchema = new Schema({
    user: {
      type: Schema.Types.ObjectId,
      ref: 'user',
    },
    // handle: {
    //   type: String,
    //   required: true,
    //   max: 40,
    // },
    company: {
      type: String,
    },
    website: {
      type: String,
    },
    location: {
      type: String,
    },
    status: {
      type: String,
      required: true,
    },
    skills: {
      type: [String],
      required: true,
    },
    bio: {
      type: String,
    },
    githubusername: {
      type: String,
    },
    experience: [
      {
        title: {
          type: String,
          required: true,
        },
        company: {
          type: String,
          required: true,
        },
        location: {
          type: String,
        },
        from: {
          type: Date,
          required: true,
        },
        to: {
          type: Date,
        },
        current: {
          type: Boolean,
          default: false,
        },
        description: {
          type: String,
        },
      },
    ],
    education: [
      {
        school: {
          type: String,
          required: true,
        },
        degree: {
          type: String,
          required: true,
        },
        fieldofstudy: {
          type: String,
          required: true,
        },
        from: {
          type: Date,
          required: true,
        },
        to: {
          type: Date,
        },
        current: {
          type: Boolean,
          default: false,
        },
        description: {
          type: String,
        },
      },
    ],
    social: {
      youtube: {
        type: String,
      },
      twitter: {
        type: String,
      },
      facebook: {
        type: String,
      },
      linkedin: {
        type: String,
      },
      instagram: {
        type: String,
      },
    },
    date: {
      type: Date,
      default: Date.now,
    },
  });

  module.exports = Profile = mongoose.model('profile', ProfileSchema);

  ```