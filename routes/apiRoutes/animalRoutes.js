// dependencies
// app() cannot be used across modules because it is defined in server.js
// instead use Router, which allows you to declare routes in any file with the proper middleware
const router = require('express').Router();
const { filterByQuery, findById, createNewAnimal, validateAnimal } = require('../../lib/animals');
const { animals } = require('../../data/animals');

// route that the front-end can request data from
// get() requires two arguments:
// 1) string that describes the route the client will have to fetch from
// 2) a callback function that will execute everytime that route is accessed with a GET request
router.get('/animals', (req, res) => {
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
router.get('/animals/:id', (req, res) => {
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
router.post('/animals', (req, res) => {
    // req.body is where our incoming content will be
    // set id based on what the next index of the array will be
    req.body.id = animals.length.toString();
    
    // if any data in req.body is incorrect, send 400 error
    if (!validateAnimal(req.body)) {
        // method relays message to client with code and explanation of what went wrong
        // anything in 400 range is a user error, not server error
        res.status(400).send('The animal is not properly formatted.');
    } else {
        // add animal to json file and animals array in this function
        const animal = createNewAnimal(req.body, animals)
    
        res.json(animal);
    }
});

// export router module
module.exports = router;