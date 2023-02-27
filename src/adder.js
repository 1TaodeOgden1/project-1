const { padStart } = require('lodash');

// stores saved ingredients and instruction steps, to be JSONified
const ingredientList = []; // an array of {name: string , amount: string} objects
const instructionList = []; // array of strings

window.onload = init;

const init = () => {
  const addIngredBtn = document.querySelector('#addIngred');
  const clrIngredBtn = document.querySelector('#clearIngred');
  const addInstructBtn = document.querySelector('#addInstruct');
  const clrInstructBtn = document.querySelector('#clearInstruct');
  const submitBtn = document.querySelector('#submitRecipe');

  // clears the list of added ingredients
  clrIngredBtn.addEventListener('click', () => {
    document.querySelector('#ingred').innerHTML = '<ul></ul>';
  });

  // clears the list of added instructions
  clrInstructBtn.addEventListener('click', () => {
    document.querySelector('#instructions ol').innerHTML = '<ol></ol>';
  });

  // adds {name: string , amount: string} object with the two ingredient form fields.
  addIngredBtn.addEventListener('click', () => {
    const ingredName = document.querySelector('#ingredName');
    const ingredQuantity = document.querySelector('#ingredQuantity');

    ingredientList.push(
      {
        name: ingredName.value,
        amount: ingredQuantity.value,
      },
    );

    // clear text fields
    ingredName.value = '';
    ingredQuantity.value = '';
  });

  // adds a new instruction step to the recipe draft
  addInstructBtn.addEventListener('click', () => {
    const step = document.querySelector('#instructInput');

    instructionList.push(step.value);

    // clear text fields
    step.value = '';
  });

  // create an object with data from the text fields and the arrays and send it to the server
  // then reset the form
  submitBtn.addEventListener('click', (e) => {
    addRecipe();

    // clear all the forms
    instructionList = [];
    ingredientList = [];
    loadLists();

    document.querySelector('#nameField').value = '';
    document.querySelector('#imgLink').value = '';
  });

  // basically, every time a list is modified, we want to re-display
  // that change to the user
  addIngredBtn.addEventListener('click', loadLists);
  // clrIngredBtn.addEventListener('click', loadLists);
  addInstructBtn.addEventListener('click', loadLists);
  // clrInstructBtn.addEventListener('click', loadLists);
};

// displays currently stored ingredients & instructions for the recipe draft
function loadLists(event) {
  // prevents page refresh
  event.preventDefault();

  let newHTML = '';
  for (const step of instructionList) {
    newHTML += `<li>${step}</li>`;
  }

  document.querySelector('#instructList').innerHTML = newHTML;

  newHTML = '';
  for (const item of ingredientList) {
    newHTML += `<li>${item.amount} ${item.name}</li>`;
  }

  document.querySelector('#ingredientList').innerHTML = newHTML;
}

//send the recipe as a POST request to the server
const addRecipe = async () => {
  const name = document.querySelector('#nameField').value;
  const imgLink = document.querySelector('#imgLink').value;

  const recipeObj = {
    name,
    imgLink,
    ingredients: JSON.stringify(ingredientList),
    instructions: JSON.stringify(instructionList),
  };

  const response = await fetch(
    '/addRecipe',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-formurlencoded',
        Accept: 'application/json',
      },
      body: recipeObj,
    },
  );

  handleResponse(response);
};

// outputs the response status message to the bottom of the page
const handleResponse = async (response) => {
  // Grab the div
  const message = document.querySelector('#message');

  // Based on the status code, display something
  switch (response.status) {
    case 201: // created
      message.innerHTML = '<b>Successfully added!</b>';
      break;
    default: // any other status code
      message.innerHTML = 'Error!';
      break;
  }

  // Parse the response to json. This works because we know the server always
  // sends back json. Await because .json() is an async function.
  const obj = await response.json();

  // If we have a message, display it.
  if (obj.message) {
    message.innerHTML += `<p>${obj.message}</p>`;
  }
};
