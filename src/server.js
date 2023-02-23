// dependencies here
const http = require('http'); // pull in http module
// url module for parsing url string
const url = require('url');
// querystring module for parsing querystrings from url
const query = require('querystring');
// pull in our custom files
const htmlHandler = require('./htmlResponses.js');
const jsonHandler = require('./jsonResponses.js');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

/* borrowed from demo code */
const parseBody = (request, response, handler) => {
  // The request will come in in pieces. We will store those pieces in this
  // body array.
  const body = [];

  // The body reassembly process is event driven, much like when we are streaming
  // media like videos, etc. We will set up a few event handlers. This first one
  // is for if there is an error. If there is, write it to the console and send
  // back a 400-Bad Request error to the client.
  request.on('error', (err) => {
    console.dir(err);
    response.statusCode = 400;
    response.end();
  });

  // The second possible event is the "data" event. This gets fired when we
  // get a piece (or "chunk") of the body. Each time we do, we will put it in
  // the array. We will always recieve these chunks in the correct order.
  request.on('data', (chunk) => {
    body.push(chunk);
  });

  // The final event is when the request is finished sending and we have recieved
  // all of the information. When the request "ends", we can proceed. Turn the body
  // array into a single entity using Buffer.concat, then turn that into a string.
  // With that string, we can use the querystring library to turn it into an object
  // stored in bodyParams. We can do this because we know that the client sends
  // us data in X-WWW-FORM-URLENCODED format. If it was in JSON we could use JSON.parse.
  request.on('end', () => {
    const bodyString = Buffer.concat(body).toString();
    const bodyParams = query.parse(bodyString);

    // Once we have the bodyParams object, we will call the handler function. We then
    // proceed much like we would with a GET request.
    handler(request, response, bodyParams);
  });
};

// handlers for our POST requests
const handlePOST = (request, response, parsedUrl) => {
  if (parsedUrl.pathname === '/addUser') {
    parseBody(request, response, jsonHandler.addUser);
  }
};

const handleHEAD = (request, response, parsedUrl) => {
  if (parsedUrl.pathname === '/getUsers') {
    jsonHandler.respondJSONMeta(request, response);
  } else {
    jsonHandler.notFound(request, response);
  }
};

const handleGET = (request, response, parsedUrl) => {
  switch (parsedUrl.pathname) {
    case '/':
      htmlHandler.getIndex(request, response);
      break;
    case '/getUsers':
      jsonHandler.getUsers(request, response);
      break;
    case '/style.css':
      htmlHandler.getCSS(request, response);
      break;
    default:
      jsonHandler.notFound(request, response);
      break;
  }
};

// function to handle requests
const onRequest = (request, response) => {
  // first we have to parse information from the url
  const parsedUrl = url.parse(request.url);

  // key:value object to look up URL routes to specific functions
  switch (request.method) {
    case 'HEAD':
      handleHEAD(request, response, parsedUrl);
      break;
    case 'POST':
      handlePOST(request, response, parsedUrl);
      break;
      // handles get responses
    default:
      handleGET(request, response, parsedUrl);
      break;
  }
};

// start HTTP server
http.createServer(onRequest).listen(port, () => {
  console.log(`Listening on 127.0.0.1:${port}`);
});
