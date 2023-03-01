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
        searchFilter
    }
    //reset search params 
    //nameFilter.value = '';

    
}
