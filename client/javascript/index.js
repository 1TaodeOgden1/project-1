// querystring module for parsing querystrings from url
//here, its used to stringify params objects 
const query = require('querystring');

const recipes = [];

//set up event handlers, plus display all loaded recipes
const init = () => {

    //load all recipes; there should be no value in the name field 
    loadRecipes();
}

//grab the recipes object via a GET request
//then filter the results via the params 
//no params present = get all recipes
const loadRecipes = async () => {
    const nameFilter = document.querySelector('searchName').value;
    const params = {
        nameFilter
    }
    //grabs a JSON object with all recipes with the requested name 
    const response = await fetch(
        //send in search params as part of the object 
        `/getRecipeList${query.stringify(params)}`,
        {
            method: 'GET',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                Accept: 'application/json'
            }
        }
    )
    //reset search params 
    nameFilter.value = '';

    //notifies user of the results
    handleSearch(response);

}

const handleSearch = async (response) => {
    const message = document.querySelector('#message');
    const obj = await response.json();

    // If we have a message, display it.
    if (obj.message) {
        message.innerHTML += `<p>${obj.message}</p>`;
    }
}

window.onload = init;
