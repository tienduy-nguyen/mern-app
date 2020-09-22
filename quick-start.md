# Quick start a project nodejs clone from Github

## Install server dependencies

```
$ npm install
```

## Install client dependencies
```
$ cd client
$ npm install
```

## Run both Express & React from root
```
$ npm run dev
```

## Build for production

```
$ cd client
$ npm run build
```

## Test production before deploy

After running a build in the client point_up_2, cd into the root of the project.
And run..

```
NODE_ENV=production node server.js

```

Check in browser on [http://localhost:3000](http://localhost:5000/)