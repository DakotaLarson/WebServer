(function(){
    const express = require('express');
    const path = require('path');
    const http = require('http');
    const helmet = require('helmet');
    const compression = require('compression');
    const fs = require('fs');
    const JSDOM = require('jsdom').JSDOM;
    const database = require('./database');
    //const auth = require('./auth');

    const app = express();
    database.init();
    http.createServer(app).listen(8080);
    app.use(express.json());
    app.use(express.urlencoded({extended: true}));
    app.use(helmet());
    app.use(compression());
    app.use(express.static(path.join(__dirname, '../client/public'),{index:false,extensions:['html']}));
    app.get('/', function(req, res){
        fs.readFile(path.join(__dirname, '../client/mutable/index.html'), 'utf8', function(err, data){
            if(err !== null) {
                console.log('Error reading file: ' + err);
            }
            res.send(data);
        });
    });
    app.get('/tictactoe', function(req, res){
        fs.readFile(path.join(__dirname, '../tictactoe/index.html'), 'utf8', function(err, data){
            if(err !== null) {
                console.log('Error reading file: ' + err);
            }
            res.send(data);
        })
    });
    // app.get('/auth', function(req, res){
    //     fs.readFile(path.join(__dirname, '../client/mutable/auth.html'), 'utf8', function(err, data) {
    //         if (err !== null) {
    //             console.log('Error reading file: ' + err);
    //         }
    //         res.send(data);
    //     });
    // });
    // app.post('/auth', function(req, res){
    //     if(req.body.email && req.body['g-recaptcha-response'] && req.body.password && req.body.passwordConf && req.body.username){
    //         auth.signupUser(req.body.username, req.body.email, req.body.password, req.body.passwordConf, req.body['g-recaptcha-response'], function(code){
    //             console.log(code);
    //             fs.readFile(path.join(__dirname, '../client/mutable/auth.html'), 'utf8', function(err, data) {
    //                 if (err !== null) {
    //                     console.log('Error reading file: ' + err);
    //                 }
    //                 let dom = new JSDOM(data);
    //                 let domErr = dom.window.document.body.querySelector('.signupErr');
    //                 domErr.textContent = 'Code: ' + code;
    //                 res.send(dom.serialize());
    //                 if(code === 0){
    //                 }else if(code === 1){
    //                     //form error
    //                 }else if(code === 2){
    //
    //                 }else if(code === 3){
    //                     //email in db
    //                 }else if(code === 4){
    //                     //user in db
    //                 }else{
    //                     //db error
    //                 }
    //             });
    //
    //         });
    //     }else if(req.body.email && req.body.password){
    //         auth.signinUser(req.body.email, req.body.password, function(code){
    //             console.log(code);
    //         });
    //     }else if(req.body.email && req.body.verification){
    //         auth.verifyUser(req.body.email, req.body.verification, function(code){
    //             console.log('v ' + code);
    //         });
    //     }
    //     else{
    //         //unknown
    //     }
    //     //recorddomaintransistorcrypto
    // });
})();

