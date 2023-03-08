const recipes = [];
//grab the recipes object via a GET request
//then filter the results via the params 
//no params present = get all recipes
const loadRecipes = async () => {
    const nameFilter = document.querySelector('#searchName').value;
    const params = {
        //search isn't case sensitive
        nameFilter: nameFilter.toLowerCase()
    }
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
            params: params
        }
    );

    console.log(response.json());

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

    // If we have a message, display it.
    if (obj.message) {
        message.innerHTML += `<p>${obj.message}</p>`;
    }
}

window.onload = init;
