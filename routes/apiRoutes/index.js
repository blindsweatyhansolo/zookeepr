// MIDDLEWARE apiRoutes/index.js is being used as a central hub for all routing functions we may want to add to the app
// otherwise the app doesn't know about the routes in animalRoutes.js
// employs Router() but this time it is using the module exported from animalRoutes.js

const router = require('express').Router();
const animalRoutes = require('../apiRoutes/animalRoutes');
const zookeeperRoutes = require('../apiRoutes/zookeeperRoutes');

router.use(animalRoutes);
router.use(zookeeperRoutes);

module.exports = router;
