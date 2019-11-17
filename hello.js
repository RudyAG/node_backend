// Import a module
const http = require('http')

// Import Node url module
const url = require('url')

// Import Node querystring module
const qs = require('querystring')

const content = '<!DOCTYPE html>' +
'<html>' +
'    <head>' +
'        <meta charset="utf-8" />' +
'        <title>ECE AST</title>' +
'    </head>' + 
'    <body>' +
'         <p>Hello rudy !</p>' +
'    </body>' +
'</html>'

const serverHandle = function (req, res) {
  /* Retrieve and print the current path
  const path = url.parse(req.url).pathname;
   console.log(path);
*/

  /* Retrieve and print the queryParams
  const queryParams = qs.parse(url.parse(req.url).query);
  console.log(queryParams);
*/
  const route = url.parse(req.url)
  const path = route.pathname 
  const params = qs.parse(route.query)
  
  /*res.writeHead(200, {'Content-Type': 'text/html'});
  res.write(content);
  res.end();*/
/*
  res.writeHead(200, {'Content-Type': 'text/plain'});

  if (path === '/hello' && 'name' in params) {
    res.write('Hello ' + params['name'])
  } else {
    res.write('Hello anonymous')
  }
  res.end();
  */
 res.writeHead(404, {"Content-Type": "text/plain"});
 res.write("404 Not found");
 res.end()

}


// Declare an http server
http.createServer(serverHandle).listen(8080)

// curl localhost:8080 or go to http://localhost:8080
