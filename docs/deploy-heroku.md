# Deploy to Heroku

If you followed the sensible advice above and included config/default.json and config/production.json in your .gitignore file, then pushing to Heroku will omit your config files from the push.

However, Heroku needs these files for a successful build.

So how to get them to Heroku without commiting them to GitHub?

What I suggest you do is create a local only branch, lets call it production.

For example or `config/default.json` file
```json
{
  "mongoURI": "<your_mongoDB_Atlas_uri_with_credentials>",
  "jwtSecret": "secret",
  "githubToken": "<yoursecrectaccesstoken>"
}
```
Or you can use .env file

bash
```
$ git checkout -b production
```

We can use this branch to deploy from, with our config files.

Add the config file...

```bash
$ git add -f config/production.json
```

This will track the file in git on this branch only. 

**DON'T PUSH THE PRODUCTION BRANCH TO GITHUB**

Commit...
```bash
$ git commit -m "Ready to deploy"
```

Create your Heroku project

```bash
$ heroku create
```

And push the local production branch to the remote heroku master branch.

```bash
$ git push heroku production:master
```

Now Heroku will have the config it needs to build the project.

`Don't forget to make sure your production database is not whitelisted in MongoDB Atlas, otherwise the database connection will fail and your app will crash`


After deployment, you can delete the production branch if you like

```
$ git checkout master
$ git branch -D production
```

Or you can leave it to merge and push updates from another branch. Make any changes you need on your master branch adn merge those into your production branch.

```
$ git checkout production
$ git merge master
```

Once merged you can push to heroku as above and your site will rebuild and be updated.

### Config server.js to pre-deploy heroku

```json
{
  "name": "dev-connector",
  "version": "1.0.0",
  "description": "",
  "main": "server.js",
  "scripts": {
    "server": "nodemon server.js",
    "start": "node server.js",
    "client": "npm start --prefix client",
    "dev": "concurrently \"npm run server\" \"npm run client\"",
    "heroku-postbuild": "NPM_CONFIG_PRODUCTION=false npm i --prefix client && npm run build --prefix client",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "author": "Tien Duy",
  "license": "MIT",
  "dependencies": {
    "axios": "^0.20.0",
    "bcryptjs": "^2.4.3",
    "config": "^3.3.1",
    "dotenv": "^8.2.0",
    "express": "^4.17.1",
    "express-validator": "^6.6.0",
    "gravatar": "^1.8.1",
    "http-proxy-middleware": "^1.0.4",
    "jsonwebtoken": "^8.5.1",
    "moment": "^2.29.0",
    "mongoose": "^5.9.19",
    "normalize-url": "^5.1.0",
    "react-moment": "^0.9.7",
    "react-redux": "^7.2.1",
    "react-router-dom": "^5.2.0",
    "redux": "^4.0.5",
    "redux-devtools-extension": "^2.13.8",
    "redux-thunk": "^2.3.0",
    "request": "^2.88.2"
  },
  "devDependencies": {
    "concurrently": "^5.2.0",
    "nodemon": "^2.0.4"
  },
  "engines": {
    "node": "12.18.3"
  }
}

```