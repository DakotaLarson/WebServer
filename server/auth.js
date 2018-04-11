const request = require('request');
const database = require('./database');
const emailRegex = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

function signupUser(username, email, password, passwordConf, recaptcha, cb){
    /*Codes:
        0 - success
        1 - form error
        2 - recaptcha error
        3 - email in database error
        4 - username in database error
        5 - database error
     */
    if(username.trim() === '' ||
        email.trim() === '' ||
        password.trim() === '') {
        cb(1);
    }else if(!emailRegex.test(email)){
        cb(1);
    }else if(password !== passwordConf){
        cb(1);
    }else if(password.length < 8){
        cb(1);
    }else if(password.length > 128){
        cb(1);
    }else if(username.length > 32){
        cb(1);
    }else if(email.length > 64){
        cb(1);
    }else{
        if(!verifyRecaptcha(recaptcha, function(success){
            if(success){
                database.signupUser(username, email, password, function(code){
                    if(code === 1){
                        cb(4);
                    }else if(code === 2){
                        cb(3);
                    }else if(code === 3){
                        cb(5);
                    }else{
                        cb(0);
                    }
                });
            }else{
                cb(2);
            }
            })){
        }
    }
}
function signinUser(email, password, cb){
    /*Codes:
        0: success
        1: email not in db
        2: invalid password
        3: database error
     */
    if(!emailRegex.test(email) || email.length > 64){
        cb(1);
    }else if(password.length < 8 || password.length > 128){
        cb(2);
    }else{
        database.signinUser(email, password, function(code){
            cb(code);
        });
    }
}
function verifyUser(email, verCode, cb){
    /*Codes:
        0 - success
        1 - form error
        2 - email not in database
        3 - verification code not correct
        4 - account already verified
        5 - database error
     */
    if(!emailRegex.test(email)){
        cb(1);
    }else{
        let code = Number(verCode);
        if(isNaN(code) || code < 100000 || code > 999999){
            cb(1);
        }else{
            database.verifyUser(email, code, function(dbCode){
                if(dbCode === 1){
                    cb(2);
                }else if(dbCode === 2){
                    cb(4);
                }else if(dbCode === 3){
                    cb(3);
                }else if(dbCode === 4){
                    cb(5);
                }else{
                    cb(0);
                }
            });
        }
    }
}
function verifyRecaptcha(recaptcha, cb){
    cb(true);
    // if(recaptcha.length > 0){
    //     let options = {
    //         url: 'https://www.google.com/recaptcha/api/siteverify',
    //         form: {
    //             secret: '6LfZQEYUAAAAAPVL8B0W8Q9gffpMUzi91O1G0ynT',
    //             response: recaptcha
    //         }
    //     };
    //     request.post(options, function(options, err, response){
    //         console.log(response);
    //         let parsedBody = null;
    //         try{
    //             parsedBody = JSON.parse(response);
    //         }catch(e){
    //             console.log(e);
    //         }finally{
    //             if(parsedBody === null){
    //                 cb(false);
    //             }else{
    //                 if(parsedBody.success){
    //                     cb(true);
    //                 }else{
    //                     cb(false);
    //                 }
    //             }
    //         }
    //     });
    // }else{
    //     cb(false);
    // }
}

module.exports.signupUser = signupUser;
module.exports.signinUser = signinUser;
module.exports.verifyUser = verifyUser;
