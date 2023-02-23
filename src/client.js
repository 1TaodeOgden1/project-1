
/*All the event handlers and clientside code are here*/

const init = () => {
    //Grab the form
    const nameForm = document.querySelector('#nameForm');
    const getForm = document.querySelector('#getForm');
    const urlField = document.querySelector("#urlField");
    const methodSelect = document.querySelector("#methodSelect");

    //Create an addUser function that cancels the forms default action and
    //calls our sendPost function above.
    const addUser = (e) => {
        e.preventDefault();
        postRequest(getForm);
        return false;
    }

    const getUser = (e) => {
        e.preventDefault();
        fetchRequest(getForm);
        return false;
    }

    //Call addUser when the submit event fires on the form.
    nameForm.addEventListener('submit', addUser);
};

const postRequest = async (form) => {
    const action = form.getAttribute("action");
    const method = form.getAttribute("method");
    const name = form.querySelector("#nameField");
    const age = form.querySelector("#ageField");

    const params = `name=${name.value}&age=${age.value}`;
    let response = await fetch(action,
        {
            method,
            headers: {
                'Content-Type': 'application/x-www-formurlencoded',
                'Accept': 'application/json'
            },
            body: params
        });

    handleResponse(response, method);
}

const fetchRequest = async (form) => {

    const method = form.querySelector("#methodSelect").value;
    const url = form.querySelector("#urlField").value;

    let response = await fetch(url,
        {
            method,
            headers: {
                'Accept': 'application/json'
            },
        });

    handleResponse(response, method);
}

//Handles our FETCH response. This function is async because it
//contains an await.
const handleResponse = async (response) => {

    //Grab the content section
    const content = document.querySelector('#content');

    //Based on the status code, display something
    switch (response.status) {
        case 200: //success
            content.innerHTML = `<b>Success</b>`;
            break;
        case 201: //created
            content.innerHTML = '<b>Created</b>';
            break;
        case 204: //updated (no response back from server)
            content.innerHTML = '<b>Updated (No Content)</b>';
            return;
        case 400: //bad request
            content.innerHTML = `<b>Bad Request</b>`;
            break;
        case 404: //request not found
            content.innerHTML = `<b>Not found!<b>`;
            break;
        default: //any other status code
            content.innerHTML = `Error code not implemented by client.`;
            break;
    }

    //Parse the response to json. This works because we know the server always
    //sends back json. Await because .json() is an async function.
    let obj = await response.json();

    //If we have a message, display it.
    if (obj.message) {
        content.innerHTML += `<p>${obj.message}</p>`;
    }
};
