(function(){
    let fs = require('fs');
    let http = require('http');
    let httpProxy = require('http-proxy');

    let proxy = httpProxy.createProxyServer({
        target: {
            host: 'localhost',
            port: 8080
        },
        ssl: {
            key: fs.readFileSync('/etc/letsencrypt/live/www.dakotalarson.com/privkey.pem'),
            cert: fs.readFileSync('/etc/letsencrypt/live/www.dakotalarson.com/cert.pem')
        }
    });
    proxy.listen(443);
    proxy.on('error', function(error){
        console.log(error);
    });
    http.createServer(function(req, res){
        res.writeHead(301, { "Location": "https://" + req.headers['host'] + req.url });
    }).listen(80);
})();
