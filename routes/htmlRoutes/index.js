// dependencies
const router = require('express').Router();
const path = require('path');


// !! ROUTE ORDERS MATTER !!
// GET route for index.html
// '/' points to root route of server, since index is the root page
router.get('/', (req, res) => {
    // res.sendFile() sends the index.html to be displayed on the page
    // path module used to ensure the correct location is found for display
    res.sendFile(path.join(__dirname, '../../public/index.html'));
});

// GET route for animals.html
// '/animals' instead of adding '/api/animals' is more professional 
router.get('/animals', (req, res) => {
    res.sendFile(path.join(__dirname, '../../public/animals.html'));
});

// GET route for zookeepers.html
router.get('/zookeepers', (req, res) => {
    res.sendFile(path.join(__dirname, '../../public/zookeepers.html'));
});

// GET wildcard route (for when a client tries to visit a non-existent route) goes to index.html
// '*' (star) acts as a wildcard (any route not previously defined falls under this request)
// !! SHOULD ALWAYS COME LAST !! //
router.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../../public/index.html'));
});

// export router module
module.exports = router;