var User = Object.freeze({

    /** login
     * Attempts to log in the user. Displays error message on failure. 
     * form:    the login form
     */
    login: function(form) {
	var user = form.username.value.toLowerCase();
	var password = form.password.value;

	API.login(
	    user,
	    password,
	    function(xml) {
		if ($(xml).find('error')[0]) {
		    form.password.value = '';
		    $(form).find('#error-span').css('display', 'inline-block');
		    return;
		}
		localStorage.setItem('user', user);
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

    
    validate_password_confirm: function(e) {
	var pwc = e.parentNode.parentNode.password_confirm;

	if (pwc.value !== e.parentNode.parentNode.password.value) {
	    pwc.setCustomValidity("Passwords must match!");
	} else {
	    pwc.setCustomValidity("");
	}
    },

    /** validate_register_form
     * Invalidates the registration form. Displays potential errors.
     * Calls API.register(...) on success.
     */
    validate_register: function(form) {
	console.log("hello");
    }

});
