const $animalForm = document.querySelector('#animal-form');

const handleAnimalFormSubmit = event => {
  event.preventDefault();

  // get animal data and organize it
  const name = $animalForm.querySelector('[name="animal-name"]').value;
  const species = $animalForm.querySelector('[name="species"]').value;
  const dietRadioHTML = $animalForm.querySelectorAll('[name="diet"]');
  let diet;

  for (let i = 0; i < dietRadioHTML.length; i += 1) {
    if (dietRadioHTML[i].checked) {
      diet = dietRadioHTML[i].value;
    }
  }

  if (diet === undefined) {
    diet = '';
  }

  const selectedTraits = $animalForm.querySelector('[name="personality"').selectedOptions;
  const personalityTraits = [];
  for (let i = 0; i < selectedTraits.length; i += 1) {
    personalityTraits.push(selectedTraits[i].value);
  }
  const animalObject = { name, species, diet, personalityTraits };

  // fetch function to POST new animalObject from form
  fetch('/api/animals', {
    // method: set to POST, allows the request to make it to the proper endpoint for POSTing new animals to json file
    // headers: informs the request is going to be JSON data, necessary to receive req.body on server
    // body: stringified JSON animalObject data 
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(animalObject)
  })
  .then(response => {
    if (response.ok) {
      return response.json();
    }
    alert(`Error: ${response.statusText}`);
  })
  .then(postResponse => {
    console.log(postResponse);
    alert('Thank you for adding an animal!');
  });
};

$animalForm.addEventListener('submit', handleAnimalFormSubmit);
