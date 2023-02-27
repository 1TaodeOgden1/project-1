const fs = require('fs'); // pull in the file system module

// load the index page into memory
const index = fs.readFileSync(`${__dirname}/../client/adder.html`);
const css = fs.readFileSync(`${__dirname}/../client/css/adder.css`);

const getIndex = (request, response) => {
  console.log(__dirname);
  response.writeHead(200, { 'Content-Type': 'text/html' });
  response.write(index);
  response.end();
};

const getCSS = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/css' });
  response.write(css);
  response.end();
};

module.exports = {
  getIndex,
  getCSS,
};
