// instantiate the server
const express = require('express');
// When Heroku runs our app, it sets an environment variable called process.env.PORT
// We're going to tell our app to use that port, if it has been set, and if not, default to port 80
const PORT = process.env.PORT || 3001;
// assign express() to 'app' variablein order to chain on methods to the Express.js server later
const app = express();
const { animals } = require('./data/animals');

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

// listen() = method to make server listen for requests
app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
});