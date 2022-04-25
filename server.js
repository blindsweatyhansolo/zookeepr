// instantiate the server
const express = require('express');
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

// route that the front-end can request data from
// get() requires two arguments:
// 1) string that describes the route the client will have to fetch from
// 2) a callback function that will execute everytime that route is accessed with a GET request
app.get('/api/animals', (req, res) => {
    // res = RESPONSE
    // req = REQUEST
    let results = animals;

    // if there is a query request, results will now be returned array from filterByQuery()
    if (req.query) {
        results = filterByQuery(req.query, results);
    }

    // res.json() method sends json file, changes HTTP headers 
    res.json(results);
});

// listen() = method to make server listen for requests
app.listen(3001, () => {
    console.log('API server now on port 3001!');
});