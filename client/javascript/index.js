const recipes = [];
//grab the recipes object via a GET request
//then filter the results via the params 
//no params present = get all recipes
const loadRecipes = async () => {
    //search isn't case sensitive
    const nameFilter = document.querySelector('#searchName').value.toLowerCase();
    //grabs a JSON object with all recipes with the requested name 
    const response = await fetch(
        //send in search params as part of the object 
        //hardcoding the query params for the moment
        `/getRecipeList?name=${nameFilter}`,
        {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json'
            },
        }
    );
    //reset search params 
    nameFilter.value = '';
    
    //notifies user of the results
    handleSearch(response);
}

//set up event handlers, plus display all loaded recipes
const init = () => {

    const searchBtn = document.querySelector('#search');

    //load recipes when this button is clicked
    searchBtn.addEventListener('click', (event) => {
        event.preventDefault();
        loadRecipes();
    });

    //load all recipes; there should be no value in the name field 
    loadRecipes();
}

const handleSearch = async (response) => {
    const message = document.querySelector('#message');
    const resultsDiv = document.querySelector('#results');

    // Parse the response to json.
    const obj = await response.json();

    let newHTML = '';
    for (let r of Object.keys(obj.recipes)) {
        newHTML += `<div>
        <a href = '/viewRecipe?name=${obj.recipes[r].linkname}'><h3>${obj.recipes[r].name}</h3></a>
        <p>by ${obj.recipes[r].authorName}</p>
        </div>
      `;
    }

    resultsDiv.innerHTML = newHTML;

    // If we have a message, display it.
    if (obj.message) {
        message.innerHTML = `<p>${obj.message}</p>`;
    }
}

window.onload = init;
