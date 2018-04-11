(function(){
    let signinForm = document.querySelector('.signinForm');
    let signinFormEmail = document.querySelector('.signinFormEmail');
    let signinFormPass = document.querySelector('.signinFormPass');
    let signinFormErr = document.querySelector('.signinErr');
    let signupForm = document.querySelector('.signupForm');
    let signupFormUser = document.querySelector('.signupFormUser');
    let signupFormEmail = document.querySelector('.signupFormEmail');
    let signupFormPass = document.querySelector('.signupFormPass');
    let signupFormPassConf = document.querySelector('.signupFormPassConf');
    let signupFormErr = document.querySelector('.signupErr');
    let verifyForm = document.querySelector('.verifyForm');
    let verifyFormEmail = document.querySelector('.verifyFormEmail');
    let verifyFormCode = document.querySelector('.verifyFormNumber');
    let verifyFormErr = document.querySelector('.verifyErr');
    let authFormDisplaySignin = document.querySelector('.authFormDisplaySignin');
    let authFormDisplaySignup = document.querySelector('.authFormDisplaySignup');
    let emailRegex = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    let recaptchaVerified = false;
    if(window.location.href.endsWith('#signin')){
        signinForm.style.display = 'inline-block';
    }else if(window.location.href.endsWith('#verify')){
        verifyForm.style.display = 'inline-block';
    }else{
        signupForm.style.display = 'inline-block';
    }

    authFormDisplaySignin.addEventListener('click', function(){
        changeAuthForm(true);
    });
    authFormDisplaySignup.addEventListener('click', function(){
         changeAuthForm(false);
    });
    signupForm.addEventListener('submit', function(event){
        let signupErr = getSignupErr();
        signupFormErr.textContent = signupErr;
        if(signupErr !== ''){
            event.preventDefault();
            event.stopPropagation();
        }
    });
    signinForm.addEventListener('submit', function(event){
        let signinErr = getSigninErr();
        signinFormErr.textContent = signinErr;
        if(signinErr !== ''){
            event.preventDefault();
            event.stopPropagation();
        }
    });
    verifyForm.addEventListener('submit', function(event){
        let verifyErr = getVerifyError();
        verifyFormErr.textContent = verifyErr;
        if(verifyErr !== ''){
            event.preventDefault();
            event.stopPropagation();
        }
    });
    function changeAuthForm(toSignin){
        if(toSignin) {
            signupForm.style.display = 'none';
            signupFormUser.value = '';
            signupFormEmail.value = '';
            signupFormPass.value = '';
            signupFormPassConf.value = '';
            signinForm.style.display = 'inline-block';
            signupFormErr.textContent = '';
            signinFormEmail.focus();
        }else{
            signinForm.style.display = 'none';
            signinFormEmail.value = '';
            signinFormPass.value = '';
            signinFormErr.textContent = '';
            signupForm.style.display = 'inline-block';
            signupFormUser.focus();
        }
    }
    function getSignupErr(){
        if(signupFormUser.value.trim() === '' ||
            signupFormPass.value.trim() === '') {
            return 'Please fill out all fields';
        }else if(!emailRegex.test(signupFormEmail.value)){
            return 'Please use a valid email address';
        }else if(signupFormPass.value !== signupFormPassConf.value){
            return 'Please reconfirm your password';
        }else if(signupFormPass.value.length < 8){
            return 'Please choose a password with at least 8 characters';
        }else if(!recaptchaVerified){
            return 'Please complete the reCAPTCHA challenge';
        }else if(signupFormUser.value.length > 32){
            return 'Please limit your username to 32 characters';
        }else if(signinFormEmail.value.length > 64){
            return 'Please limit your email address to 64 characters';
        }else if(signinFormPass.value.length > 128){
            return 'Please limit your password to 128 characters';
        }
        return '';
    }
    function getSigninErr(){
        if(signinFormEmail.value.trim() === '' || signinFormPass.value.trim() === ''){
            return 'Please fill out all fields.';
        }else if(!emailRegex.test(signinFormEmail.value) || signinFormEmail.value.length > 64){
            return 'Invalid email address';
        }else if(signinFormPass.value.length < 8 || signinFormPass.value.length > 128){
            return 'Invalid password';
        }
        return '';
    }
    function getVerifyError(){
        if(!emailRegex.test(verifyFormEmail.value)){
            return 'Please use a valid email address';
        }else{
            let code = Number(verifyFormCode.value);
            if(isNaN(code) || code < 100000 || code > 999999){
                return 'Invalid verification code'
            }else{
                return '';
            }
        }
    }
    window.recapSuccess = function(){
        recaptchaVerified = true;
    };
    window.recapExpired = function(){
        recaptchaVerified = false;
    }

})();
