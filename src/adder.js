

//stores saved ingredients and instruction steps, to be JSONified  
const ingredientList = []; //an array of {name: string , amount: string} objects
const instructionList = []; //array of strings

const init = () => {
    const addIngredBtn = document.querySelector('#addIngred');
    const clrIngredBtn = document.querySelector('#clearIngred');
    const addInstructBtn = document.querySelector('#addInstruct');
    const clrInstructBtn = document.querySelector('#clearInstruct');
    const submitBtn = document.querySelector('#submitRecipe');

    //clears the list of added ingredients
    clrIngredBtn.addEventListener('click', () => {
        document.querySelector('#ingred').innerHTML = `<ul></ul>`;
    });

    //clears the list of added instructions 
    clrInstructBtn.addEventListener('click', () => {
        document.querySelector('#instructions ol').innerHTML = `<ol></ol>`;
    });

    //adds {name: string , amount: string} object with the two ingredient form fields. 
    addIngredBtn.addEventListener('click', () => {

        const ingredName = document.querySelector('#ingredName');
        const ingredQuantity = document.querySelector('#ingredQuantity');

        ingredientList.push(
            {
                name: ingredName.value,
                amount: ingredQuantity.value
            }
        );

        //clear text fields 
        ingredName.value = '';
        ingredQuantity.value = '';

    });

    //adds a new instruction step to the recipe draft
    addInstructBtn.addEventListener('click', () => {
        const step = document.querySelector('#instructInput');

        instructionList.push(step.value);

        //clear text fields
        step.value = '';
    });

    //basically, every time a list is modified, we want to re-display
    //that change to the user 
    addIngredBtn.addEventListener('click', loadLists);
    //clrIngredBtn.addEventListener('click', loadLists);
    addInstructBtn.addEventListener('click', loadLists);
    //clrInstructBtn.addEventListener('click', loadLists);
}

//create an object with data from the text fields and the arrays and send it to the server
//then reset the form 
submitBtn.addEventListener('click', (e) => {
    instructionList = []; 
    ingredientList = []; 
    
})

//displays currently stored ingredients & instructions for the recipe draft
function loadLists(event) {
    //prevents page refresh
    event.preventDefault();

    let newHTML= '';
    for (let step of instructionList) {
        newHTML += `<li>${step}</li>`;
    }

    document.querySelector("#instructList").innerHTML = newHTML;

    newHTML = '';
    for(let item of ingredientList) {
        newHTML += `<li>${item.amount} ${item.name}</li>`;
    }

    document.querySelector('#ingredientList').innerHTML = newHTML;

}

init();