// stores array of user objects
const recipes = { eggs: 'eggs' };

/* taken from body parse demo */
// function to respond with a json object
// takes request, response, status code and object to send
const respondJSON = (request, response, status, object) => {
  response.writeHead(status, { 'Content-Type': 'application/json' });
  response.write(JSON.stringify(object));
  response.end();
};

// function for 404 not found requests with message
const notFound = (request, response) => {
  // create error message for response
  const responseJSON = {
    message: 'The page you are looking for was not found.',
    id: 'notFound',
  };

  // return a 404 with an error message
  return respondJSON(request, response, 404, responseJSON);
};

// returns objects in the list that fulfill the search params
const getRecipeList = (request, response, params) => {
  const responseJSON = {
    message: '',
  };

  // filter out recipes that don't have matching names
  // if (params.name != '') {
  //   const filteredRecipes = {};

  //   for (const r in recipes) {
  //     console.log(r);
  //     // if (recipes[r].name.includes(params.name)) {
  //     //   //copy recipe over to filteredRecipes
  //     //   filteredRecipes[r] = recipes[r];
  //     // }
  //   }

  // }

  return respondJSON(request, response, 204, responseJSON);
};

// For HEAD request functionality; grabs metadata for the three main pages
const respondJSONMeta = (request, response, status) => {
  response.writeHead(status, { 'Content-Type': 'application/json' });
  response.end();
};

const getAdderMeta = (request, response) => respondJSONMeta(request, response, 200);

const getIndexMeta = (request, response) => respondJSONMeta(request, response, 200);

const getViewerMeta = (request, response) => respondJSONMeta(request, response, 200);

const addRecipe = (request, response, body) => {
  const responseJSON = {
    message: '',
  };

  // if a name, a list of ingredients or instructions is not provided
  if (!body.name || !body.instructions || !body.ingredients) {
    // shows the user what fields they haven't filled
    if (!body.name) {
      responseJSON.message += 'Recipe name not provided!';
    }
    if (body.ingredients.length === 0) {
      responseJSON.message += '<br>A list of ingredients was not provided!';
    }
    if (body.instructions.length === 0) {
      responseJSON.message += '<br>A list of instructions was not provided!';
    }

    responseJSON.id = 'missingParams';
    return respondJSON(request, response, 400, responseJSON);
  }

  // default status code to 204 updated
  let responseCode = 204;

  // If the recipe doesn't exist yet
  if (!recipes[body.name]) {
    // Set the status code to 201 (created) and create an empty user
    responseCode = 201;
    recipes[body.name] = {};
  }

  // add or update fields for this recipe
  recipes[body.name].name = body.name;
  recipes[body.name].instructions = body.instructions;
  recipes[body.name].imgLink = body.imgLink;
  recipes[body.name].ingredients = body.ingredients;

  // if response is created, then set our created message
  // and sent response with a message
  if (responseCode === 201) {
    responseJSON.message = 'Created Successfully';
    return respondJSON(request, response, responseCode, responseJSON);
  }
  // 204 has an empty payload, just a success
  // It cannot have a body, so we just send a 204 without a message
  // 204 will not alter the browser in any way!!!
  return respondJSONMeta(request, response, responseCode);
};

module.exports = {
  notFound,
  addRecipe,
  getRecipeList,
  respondJSONMeta,
  getAdderMeta,
  getIndexMeta,
  getViewerMeta,
  respondJSON,
};
