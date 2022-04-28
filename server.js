// const fs = require('fs');
// 'path' module provides utilities for working with file and directory paths, makes working with fs more predictable
// const path = require('path');
// instantiate the server
const express = require('express');
// When Heroku runs our app, it sets an environment variable called process.env.PORT
// We're going to tell our app to use that port, if it has been set, and if not, default to port 80
const PORT = process.env.PORT || 3001;
// assign express() to 'app' variablein order to chain on methods to the Express.js server later
const app = express();
// reads index.js file from each directory (default)
const apiRoutes = require('./routes/apiRoutes');
const htmlRoutes = require('./routes/htmlRoutes');


// !! ALL app.use() FUNCTIONS MUST BE SET UP EVERYTIME YOU CREATE A SERVER THAT ACCEPTS POST DATA !!
// app.use() method mounts a function (middleware) to the server that requests pass through
// before getting to the intended endpoint

// express.urlencoded({ extended: true }) method that takes incoming POST data and converts it to key/value pairs
// that can be accessed in the req.body object; {extended:true} option informs server that there may be nested sub-arry data
// parse incoming string or array data //
app.use(express.urlencoded({ extended: true }));

// express.json() takes incoming POST date in the from of JSON and parses it into the req.body JS object
// parse incoming JSON data //
app.use(express.json());

// express.static() is middleware that instructs the server to make certain files readily available (not stuck behind server endpoint)
// this ensures that all style sheets, js sheets, images, etc (everything in client facing 'public' folder) are ready
// for use so that individual routes do not have to be created; !! USE FOR SERVERS SERVING FRONT END AS WELL AS JSON DATA !!
app.use(express.static('public'));



// when a client navigates to <ourhost>/api, the app will use the router set up in apiRoutes
// if '/' is the endpoint, then the router will serve back the htmlRoutes
app.use('/api', apiRoutes);
app.use('/', htmlRoutes);

// listen() = method to make server listen for requests
// can be placed at any point after 'app' is declared
app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
});