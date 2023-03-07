// stores array of user objects
const recipes = {};

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

// returns the recipe as a raw JSON
const getRecipes = (request, response) => {
  const responseJSON = {
    recipes,
  };

  return respondJSON(request, response, 200, responseJSON);
};

const respondJSONMeta = (request, response, status) => {
  response.writeHead(status, { 'Content-Type': 'application/json' });
  response.end();
};

const addRecipe = (request, response, body) => {
  const responseJSON = {
    message: 'A form was missing / not filled!',
  };

  // if a name is missing or no instructions were added
  if (!body.name || !body.instructions) {
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
  getRecipes,
  respondJSONMeta,
  respondJSON
};
