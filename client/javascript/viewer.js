const init = () => {
    //console.log(window.location);
    //https://ui.dev/get-current-url-javascript
    //grab params again using the windows.location object
    grabRecipe(window.location.search);
}

//make the GET request to the server and get the named recipe
const grabRecipe = async (paramstring) => {

    const response = await fetch(
        `/getRecipe${paramstring}`,
        {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json'
            },
        }
    )

    handleRecipe(response);

}

//display recipe data on the page
const handleRecipe = async (response) => {

    const obj = await response.json();

    console.log(obj);
    
    document.querySelector('#recipeName').textContent = obj.recipe.name; 
    document.querySelector('#author').textContent = `Written by ${obj.recipe.authorName}`;
    
    //build a new HTML string as we iterate thru both lists
    const ingredList = document.querySelector('#ingredients ul');
    let newHTML = ''; 
    for(let i of obj.recipe.ingredients){
        newHTML += `<li>${i.amount} ${i.name}</li>`;
    }

    ingredList.innerHTML = newHTML;

    newHTML = '';
    const instructList = document.querySelector('#instructions ol');
    for(let s of obj.recipe.instructions){
        newHTML += `<li>${s}</li>`;
    }
    instructList.innerHTML = newHTML;

}

window.onload = init; 