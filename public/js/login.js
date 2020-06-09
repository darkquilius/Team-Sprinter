$(document).ready(function () {
    // Getting references to our form and inputs
    var loginForm = $('form.login');
    var usernameInput = $('input#username-input');
    var passwordInput = $('input#password-input');
    var registerBtn = $('input.register-btn');

    // When the form is submitted, we validate there's an email and password entered
    loginForm.on('submit', function (event) {
        event.preventDefault();
        var userData = {
            username: usernameInput.val().trim(),
            password: passwordInput.val().trim()
        };

        if (!userData.username || !userData.password) {
            return;
        }

        // If we have an username and password we run the loginUser function and clear the form
        loginUser(userData.username, userData.password);
        usernameInput.val('');
        passwordInput.val('');
    });

    // loginUser does a post to our "api/login" route and if successful, redirects us the the members page
    function loginUser(username, password) {
        $.post('/api/login', {
            username: username,
            password: password
        })
            .then(function () {
                //go into secure area
                window.location.replace('/in');
            })
            .catch(function (err) {
                console.log(err);
            });
    }

    registerBtn.on('click', handleRegisterRedirect);

    function handleRegisterRedirect(event) {
        event.preventDefault();
        console.log('click');

        window.location.replace('/signup');
    }
});
