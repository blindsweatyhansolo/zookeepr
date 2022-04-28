// dependencies
const fs = require('fs');
const path = require('path');

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

        console.log(personalityTraitsArray);

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

// function to find animal by id
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
    fs.writeFileSync(path.join(__dirname, '../data/animals.json'),
    JSON.stringify({ animals: animalsArray }, null, 2)
    );

    // return finished code to post route for response
    return animal;
};

// function to validate POST data
function validateAnimal(animal) {
    if (!animal.name || typeof animal.name !== 'string') {
        return false;
    }
    if (!animal.species || typeof animal.species !== 'string') {
        return false;
    }
    if (!animal.diet || typeof animal.diet !== 'string') {
        return false;
    }
    if (!animal.personalityTraits || !Array.isArray(animal.personalityTraits)) {
        return false;
    }
    return true;
};

// export module functions
module.exports = {
    filterByQuery,
    findById,
    createNewAnimal,
    validateAnimal
};