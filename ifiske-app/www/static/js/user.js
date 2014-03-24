var User = Object.freeze({

    /** login
     * Attempts to log in the user. Displays error message on failure. 
     * form:    the login form
     */
    login: function(form) {
	API.login(
	    form.username.value, 
	    form.password.value, 
	    function(xml) {
		if ($(xml).find('error')[0]) {
		    form.password.value = '';
		    $(form).find('#error-span').css('display', 'inline-block');
		    return;
		}

		localStorage.setItem('user', user.toLowerCase());
		localStorage.setItem('password', password);
		// Avoid back stack entry
		Navigate.init();
	    });
    },

    /** logout
     * Clears local authentication data.
     */
    logout: function() {
        localStorage.removeItem('user');
        localStorage.removeItem('password');
	// Avoid back stack entry
        Navigate.init();
    },

    /** validate_register_form
     * Validates the registration form. Displays potential errors.
     * Calls API.register(...) on success.
     */
    validate_register_form: function(form) {

	// Remove leading and trailing white spaces
	var username = form.username.value.trim();
	var password = form.password.value.trim();
	var fullname = form.fullname.value.trim();
	var email = form.email.value.trim();

	// Remove all occurances of white spaces and -
	var phone = form.phone.value.replace(/[\s-]/g,'');

	var valid = true;

	// username should contain only a-z (case insensitive)
	// and/or digits, and be at least 6 characters long.
	if ((/^[a-z\d]{6,}$/i).test(username)) {
	    console.log("invalid username");
	    valid = false;
	}
	// password should be at least 8 characters long.
	if ((/^.{8,}$/).test(password)) {
	    console.log("invalid password");
	    valid = false;
	}
	// phone should contain only digits, and be at least 8
	// characters long
	if ((/^\d{8,}$/).test(phone)) {
	    console.log("invalid phone number");
	    valid = false;
	}
	
	if (valid)
	    console.log("validated!");/*
	    API.register(username, password, fullname, email, phone,
			 // Callback
			 function() {
			     
			 });
				      */
    }
});
