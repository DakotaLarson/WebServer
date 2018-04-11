const mysql = require('mysql');
const bcrypt = require('bcrypt');
const randomInteger = require("random-number-csprng");


let connection = undefined;
function init(){
    connection = mysql.createConnection({
        host: 'localhost',
        user: 'webserver',
        password: 'K4DN3b9uFgQDWVlE',
        database: 'personal'
    });
    connection.connect(function(err){
        if(err){
            console.error(err);
        }
        console.log('Connected to Database');
    });
}
function signupUser(username, email, password, cb){
    /*Codes
        0: success
        1: username already exists
        2: email already exists
        3: generic database error
     */
    if(connection.state === 'authenticated'){
        let query = 'SELECT SUM(username = ' + mysql.escape(username) + ') usernameCount, SUM(email = ' + mysql.escape(email) + ') emailCount FROM users;';
        connection.query(query, function(err, result){
            if(err){
                console.log('Database error: ' + err);
                cb(3);
            }else{
                let usernameCount = Number(result[0].usernameCount);
                let emailCount = Number(result[0].emailCount);
                 if(emailCount > 0){
                     cb(2);
                }else if(usernameCount > 0){
                    cb(1);
                }else{
                    bcrypt.genSalt(10, function(err, salt){
                        if(err){
                            console.log("Database error: " + err);
                            cb(3);
                        }else{
                            bcrypt.hash(password, salt, function(err, hashedPass){
                                if(err){
                                    console.log('Database error: ' + err);
                                    cb(3);
                                }else{
                                    randomInteger(100000, 999999, function(err, randInt){
                                        if(err){
                                            console.log('Database error: ' + err);
                                        }else{
                                            let escUser = mysql.escape(username);
                                            let escEmail = mysql.escape(email);
                                            let escPass = mysql.escape(hashedPass);
                                            let escStatus = mysql.escape(randInt);
                                            let insertQuery = 'INSERT INTO users (username, email, password, status) VALUES (' + escUser + ', ' + escEmail + ', ' + escPass + ', ' + escStatus + ');';
                                            connection.query(insertQuery, function(err){
                                                if(err){
                                                    console.log('Database error: ' + err);
                                                    cb(3);
                                                }else{
                                                    cb(0);
                                                }
                                            });
                                        }
                                    });
                                }
                            });
                        }
                    });
                }
            }
        });
    }else{
        console.log('Database in wrong state: ' + connection.state);
        cb(3);
    }
}
function signinUser(email, password, cb){
    /*Codes
        0: success
        1: email not in database
        2: invalid password
        3: not verified
        4: account disabled
        5: generic database error
    */
    if(connection.state === 'authenticated'){
        let query = 'SELECT password, status FROM users WHERE email = ' + mysql.escape(email) + ';';
        connection.query(query, function(err, result){
            if(err !== null){
                console.log('Database error: ' + err);
                cb(5);
            }else{
                if(result.length === 0 || result.length > 1){
                    if(result.length > 1){
                         console.log('Database error: Multiple results from account selection');
                         cb(5)
                    }else{
                        cb(1);
                    }
                }else{
                    let contents = result[0];
                    if(contents.status > 0){
                        cb(3);
                    }else if(contents.status < 0){
                        cb(4);
                    }else{
                        bcrypt.compare(password, contents.password, function(err, res){
                            if(err){
                                console.log('Database error: ' + err);
                                cb(5);
                            }else if(!res){
                                cb(2);
                            }else{
                                cb(0);
                            }
                        });
                    }
                }
            }
        });
    }
}
function verifyUser(email, code, cb){
    /* Codes
        0 - success
        1 - email not in database
        2 - account already verified
        3 - verification code incorrect
        4 - database error
     */
    if(connection.state === 'authenticated'){
        let escEmail = mysql.escape(email);
        let query = 'SELECT status FROM users WHERE email = ' + escEmail + ';';
        connection.query(query, function(err, result){
            if(err){
                console.log('Database Error: ' + err);
                cb(4);
            }else{
                if(result.length === 0){
                    cb(1);
                }else if(result.length > 1){
                    console.log('Database Error: Multiple accounts returned during verification selection.');
                    cb(4);
                }else{
                    let status = result[0].status;
                    if(status === 0){
                        cb(2);
                    }else if(status !== code){
                        cb(3);
                    }else{
                        query = 'UPDATE users SET status = 0 WHERE email = ' + escEmail + ';';
                        connection.query(query, function(err){
                            if(err){
                                console.log('Database Error: ' + err);
                                cb(4);
                            }else{
                                cb(0);
                            }
                        });
                    }
                }
            }
        })
    }
}
module.exports.init = init;
module.exports.signupUser = signupUser;
module.exports.signinUser = signinUser;
module.exports.verifyUser = verifyUser;
/*
id - autoincrement
username - varchar
email - varchar
password - varchar
status - integer
 */
//insert into users (username, email, password, status) VALUES ('test', 'test@test.com', 'testpass', 1000);
