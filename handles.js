// Necessary imports
module.exports = {

    
    serverHandle : function (req, res) {
        // Import a module
        const http = require('http')

        // Import Node url module
        const url = require('url')

        // Import Node querystring module
        const qs = require('querystring')
    
        const route = url.parse(req.url)
        const path = route.pathname 
        const params = qs.parse(route.query)

        if (path !== '/hello' ) {
            res.writeHead(404, {"Content-Type": "text/plain"});
            res.write("404 Not found");
            res.end();
        }
        
        else {
            res.writeHead(200, {'Content-Type': 'text/plain'});
            if (path === '/hello' && 'name' in params) {
                res.write('Hello ' + params['name'])
            }
            else {
                 res.write('Hello anonymous')
                }
            res.end();
        }
    }
}