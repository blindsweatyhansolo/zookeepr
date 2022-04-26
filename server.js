const fs = require('fs');
// 'path' module provides utilities for working with file and directory paths, makes working with fs more predictable
const path = require('path');
// instantiate the server
const express = require('express');
const { animals } = require('./data/animals');
// When Heroku runs our app, it sets an environment variable called process.env.PORT
// We're going to tell our app to use that port, if it has been set, and if not, default to port 80
const PORT = process.env.PORT || 3001;
// assign express() to 'app' variablein order to chain on methods to the Express.js server later
const app = express();
// !! BOTH OF THE NEXT TWO FUNCTIONS MUST BE SET UP EVERYTIME YOU CREATE A SERVER THAT ACCEPTS POST DATA !!
// app.use() method mounts a function (middleware) to the server that requests pass through
// before getting to the intended endpoint
// ^^ express.urlencoded({ extended: true }) method that takes incoming POST data and converts it to key/value pairs
// that can be accessed in the req.body object; {extended:true} option informs server that there may be nested sub-arry data
// parse incoming string or array data //
app.use(express.urlencoded({ extended: true }));
// express.json() takes incoming POST date in the from of JSON and parses it into the req.body JS object
// parse incoming JSON data //
app.use(express.json());

// filter functionality (creating query endpoints)
// takes req.query as argument, filters through the animals accordingly returning new array
function filterByQuery(query, animalsArray) {
    // set up empty array
    let personalityTraitsArray = [];

    // save animalsArray as filteredResults
    let filteredResults = animalsArray;
    
    // if query is by personality traits
    if (query.personalityTraits) {
        // save personalityTraits as dedicated array
        // if personalityTraits is a string, place it into a new array and save
        if (typeof query.personalityTraits === 'string') {
            personalityTraitsArray = [query.personalityTraits];
        } else {
            personalityTraitsArray = query.personalityTraits;
        }

        // loop through each trait in the personalityTraits array
        personalityTraitsArray.forEach(trait => {
            // check trait against each animal in filterResults array (initially a copy of animalsArray)
            // updating it for each trait in the loop. For each trait being targeted by the filter, filterResults array
            // will then contain only the entries that contain the trait so that in the end an array of animals
            // that have every one of the traits when the forEach loop is finished will be made
            filteredResults = filteredResults.filter(
                animal => animal.personalityTraits.indexOf(trait) !== -1
            );
        });
    }

    // if query is by diet
    if (query.diet) {
        filteredResults = filteredResults.filter(animal => animal.diet === query.diet);
    }
    // if query is by species
    if (query.species) {
        filteredResults = filteredResults.filter(animal => animal.species === query.species);
    }
    // if query is by name
    if (query.name) {
        filteredResults = filteredResults.filter(animal => animal.name === query.name);
    }

    // return the new filtered array
    return filteredResults;
};

function findById(id, animalsArray) {
    const result = animalsArray.filter(animal => animal.id === id)[0];

    return result;
};

// function that accepts the POST route's req.body value (body) and the array that the data will be added to (animalsArray)
function createNewAnimal(body, animalsArray) {
    const animal = body;
    animalsArray.push(animal);

    // write to animals.json
    // writes animals.json in the data subdirectory with path.join()
    // __dirname represents the directory of the file we execute the code in, joins with the path to animals.json
    // array data saved/converted to JSON with stringify()
    // null argument means we don't want to edit any of the existing data
    // 2 indicates we want to create white space between our values more readibility
    fs.writeFileSync(path.join(__dirname, './data/animals.json'),
    JSON.stringify({ animals: animalsArray }, null, 2)
    );

    // return finished code to post route for response
    return animal;
};

// route that the front-end can request data from
// get() requires two arguments:
// 1) string that describes the route the client will have to fetch from
// 2) a callback function that will execute everytime that route is accessed with a GET request
app.get('/api/animals', (req, res) => {
    // res = RESPONSE
    // req = REQUEST
    let results = animals;

    // if there is a query request, results will now be returned array from filterByQuery()
    // req.query is multifaceted, often combining multiple parameters
    if (req.query) {
        results = filterByQuery(req.query, results);
    }

    // res.json() method sends json file, changes HTTP headers 
    res.json(results);
});

// route to the front-end that can request data using the id
app.get('/api/animals/:id', (req, res) => {
    // (compared to req.query) req.params is specific to a single property, often intended to retrieve a single record
    const result = findById(req.params.id, animals);
    
    // if no matching result, send 404 error code
    if (result) {
        res.json(result);
    } else {
        res.send(404);
    }
});

// route that listens for POST requests, accepts data to be used/stored server-side
// post() represents the action of a client requesting the server
// to accept data rather than vice versa with get()
app.post('/api/animals', (req, res) => {
    // req.body is where our incoming content will be
    // set id based on what the next index of the array will be
    req.body.id = animals.length.toString();
    
    // add animal to json file and animals array in this function
    const animal = createNewAnimal(req.body, animals)

    res.json(animal);
});

// listen() = method to make server listen for requests
// can be placed at any point after 'app' is declared
app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
});