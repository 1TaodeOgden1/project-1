// stores array of recipe objects, with the properties listed below
const recipes = {
  // Sample recipe
  'Chocolate Chip Cookies': {
    name: 'Chocolate Chip Cookies',
    authorName: 'Taode Ogden',
    ingredients: [
      {
        name: 'unsalted butter',
        amount: '3 tablespoons',
      },
      {
        name: 'semisweet chocolate',
        amount: '6 ounces',
      },
      {
        name: 'large eggs, at room temperature, yolks and whites separated',
        amount: '3',
      },
      {
        name: 'cream of tartar',
        amount: '½ teaspoon',
      },
      {
        name: 'sugar',
        amount: '¼ cup',
      },
      {
        name: 'heavy cream, cold',
        amount: '1/2 cup',
      },
      {
        name: 'vanilla extract',
        amount: '½ teaspoon',
      }],
    instructions: [
      'Place the butter in a medium microwave-safe bowl. Break the chocolate into small pieces directly into the bowl. Microwave it in 20-second intervals, stirring between each bout of heat, until the chocolate is about 75% melted. Stir, allowing the residual heat in the bowl to melt the chocolate completely. (Alternatively, place the chocolate and butter in a heatproof bowl and place over a saucepan containing about 1 inch of barely simmering water. Stir with a wooden spoon until the chocolate is melted and the mixture is smooth.) Let the mixture cool for a few minutes, then whisk in the egg yolks one at a time, mixing until smooth after each addition. Set aside.',
      "In another bowl, beat the heavy cream on medium-high speed until it begins to thicken up. Add the remaining 2 tablespoons of sugar and the vanilla and continue beating until the cream holds medium peaks (when you lift the beaters or whisk out of the bowl, the peaks will slightly droop down, but they won't lose their shape entirely). Fold the whipped cream into the chocolate mixture. Be sure it is fully incorporated but don't mix any more than necessary. Divide the mousse between 6 individual glasses, cover, and chill until set, at least 2 hours.",
      'Up to a few hours before serving, whip the cream until it begins to thicken up. Add the sugar and whip to medium peaks. Dollop the whipped cream over the mousse and top with chocolate shavings.',
    ],
    linkname: 'Chocolate+Chip+Cookies',
  },
};

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
  // JSON object to send
  const responseJSON = {

  };

  // filter out recipes that don't have matching names
  if (params.name !== '') {
    const filteredRecipes = {};

    for (let i = 0; i++; i < Object.keys(recipes).length) {
      // check if the recipe's name contains the searched name
      const recipeName = recipes[Object.keys(recipes)[i]].name;
      // the search param is not case sensitive
      if (recipeName.toLowerCase().includes(params.name)) {
        // copy recipe over to filteredRecipes
        // https://stackoverflow.com/questions/122102/what-is-the-most-efficient-way-to-deep-clone-an-object-in-javascript
        filteredRecipes[recipeName] = JSON.parse(JSON.stringify(recipes[recipeName]));
      }
    }
    // code above is equivalent to:
    // for (const r of Object.keys(recipes)) {
    //   if (recipes[r].name.toLowerCase().includes(params.name)) {

    //     filteredRecipes[r] = JSON.parse(JSON.stringify(recipes[r]));
    //   }
    // }

    responseJSON.recipes = filteredRecipes;
  } else {
    // no search params; send all recipes by default
    responseJSON.recipes = recipes;
  }

  responseJSON.message = `${Object.keys(responseJSON.recipes).length} recipes found.`;
  return respondJSON(request, response, 200, responseJSON);
};


//adds a new recipe JSON object to the server
//a modified version of the addUser method from the bodyparse demo
const getRecipe = (request, response, params) => {
  // JSON object to send
  const responseJSON = {
    message: 'recipe retrieved.',
    id: 'found',
  };

  // convert the link name to find the key for the recipe
  responseJSON.recipe = recipes[params.name.replace('+', ' ')];

  return respondJSON(request, response, 200, responseJSON);
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
    if (body.name === '') {
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
  recipes[body.name].authorName = body.authorName;
  recipes[body.name].instructions = body.instructions;
  recipes[body.name].ingredients = body.ingredients;
  recipes[body.name].linkname = body.linkname;

  // if response is created, then set our created message
  // and sent response with a message
  if (responseCode === 201) {
    responseJSON.message = 'Created Successfully';
    return respondJSON(request, response, responseCode, responseJSON);
  }

  /*Borrowed from class code*/ 
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
  getRecipe,
};
