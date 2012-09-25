/*
 * server.js
 *
 * Creates the web server for serving statics files
 *
 */

var http = require('http'),
    fs = require('fs'),
    path = require('path');
    
console.log('@ server');


function start(){
    
    // create http server
    var server = http.createServer(handler).listen(8888);
    console.log(' [*] server started')
    // request/response handler
    function handler(req, res){
        
        var pathname = req.url,
            basename = path.basename(pathname) || 'index.html',
            ext = path.extname(req.url),
            dirname = path.dirname(__dirname),

            filename = (req.url==='/')?basename:req.url;
            filepath = (ext=='.js') ? path.normalize(dirname+"/client/js/"+filename)
                                    : path.normalize(dirname+"/client/"+filename)


        fs.readFile(filepath,
            function(err, data) {
                if(err){
                    res.writeHead(500);
                    res.end("error: 500");
                }

                res.writeHead(200);
                res.end(data);
        });
    }
    return server;
};

exports.start = start;
