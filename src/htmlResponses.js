const fs = require('fs'); // pull in the file system module

// load all the pages & their stylesheets + js files into memory
const adder = fs.readFileSync(`${__dirname}/../client/adder.html`);
const adderJS = fs.readFileSync(`${__dirname}/../client/javascript/adder.js`);
const adderCSS = fs.readFileSync(`${__dirname}/../client/css/adder.css`);

const recipeViewer = fs.readFileSync(`${__dirname}/../client/viewer.html`);
const recipeViewerJS = fs.readFileSync(`${__dirname}/../client/javascript/viewer.js`);
const recipeViewerCSS = fs.readFileSync(`${__dirname}/../client/css/viewer.css`);

const recipeIndex = fs.readFileSync(`${__dirname}/../client/recipe_index.html`);
const recipeIndexJS = fs.readFileSync(`${__dirname}/../client/javascript/index.js`);
const recipeIndexCSS = fs.readFileSync(`${__dirname}/../client/css/index.css`);

/* from demo code */
// A simple helper function for serving up static files
const serveFile = (response, file, contentType) => {
  response.writeHead(200, { 'Content-Type': contentType });
  response.write(file);
  response.end();
};

const getIndex = (request, response) => {
  serveFile(response, recipeIndex, 'text/html');
};

const getIndexCSS = (request, response) => {
  serveFile(response, recipeIndexCSS, 'text/css');
};

const getIndexJS = (request, response) => {
  serveFile(response, recipeIndexJS, 'application/json');
};

const getRecipe = (request, response) => {
  serveFile(response, recipeViewer, 'text/html');
};

const getRecipeCSS = (request, response) => {
  serveFile(response, recipeViewerCSS, 'text/css');
};

const getRecipeJS = (request, response) => {
  serveFile(response, recipeViewerJS, 'application/json');
};
const getAdder = (request, response) => {
  serveFile(response, adder, 'text/html');
};

const getAdderJS = (request, response) => {
  serveFile(response, adderJS, 'application/javascript');
};

const getAdderCSS = (request, response) => {
  serveFile(response, adderCSS, 'text/css');
};

module.exports = {
  getIndex,
  getIndexJS,
  getIndexCSS,
  getRecipe,
  getRecipeCSS,
  getRecipeJS,
  getAdder,
  getAdderJS,
  getAdderCSS,
};
