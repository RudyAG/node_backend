
AGOT Rudy
FERAY BEAUMONT Louis
# First Node & Git project

Create a basic app with three routes:

- `/` explains how `/hello` works
- `/hello` takes a `name` query parameter and
  - random names replies `hello [name]`
  - your own name replies with a short intro of yourself
  - any other replies a 404 code with a not found message

You should have an `index.js` file with the server creation and `handles.js` defining the server's callback

Add a `package.json` file with you module declaration

Add a `readme.md` file with title, introduction, run instructions and your name

Push it all to a GitLab / GitHub repository and send a link to your repository to sergei@adaltas.com


## My First Node & my Git project

In hello.js, a server gives a plain text response 
for exemple:
localhost:8080/hello?name=rudy
return "hello rudy"
parameters are after ? like that localhost:8080/hello?key=value

//The 404 part :

        if (path !== '/hello' ) {
            res.writeHead(404, {"Content-Type": "text/plain"});
            res.write("404 Not found");
            res.end();
        }
        # N o d e   B a c k e n d   