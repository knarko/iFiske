var User = Object.freeze({

    /** login
     * Attempts to log in. Displays error message on failure.
     * form:    the login form
     *          should contain a username and password input field
     */
    login: function(form) {
        var user = form.username.value.toLowerCase();
        var password = form.password.value;

        API.authenticate (
            user,
            password,
            function(xml) {
		xml = $(xml)
                
		// If no error messages were recieved from the server
		if (xml.find('error').length == 0) {
		    /* Set localStorage values used for further authenticated
		       requests */
		    localStorage.setItem('password', password);
		    localStorage.setItem(
			'user', 
			xml.find('user')[0].getAttribute('username')
		    );
		    
		    // Avoid back stack entry
                    Navigate.init();
            
		} else {
		    /* Clear the password input field and display error msg */
                    form.password.value = '';
                    $(form).find('.error-span').css('display', 'block');
                }
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
	var pwc = e.parentNode.password_confirm;
	
	if (pwc.value.trim() !== "" &&
	    pwc.value.trim() !== e.parentNode.password.value.trim()) {
	    pwc.setCustomValidity("Passwords must match!");
	} else {
	    pwc.setCustomValidity("");
	}
    },

    /** validate_register_form
     * Validates the registration form. Triggers display of error messages.
     * Calls API.register() on success.
     */
    validate_register: function(form) {
	var username = form.username.value.trim();
	var password = form.password.value.trim();
	var fullname = form.fullname.value.trim();
	var email = form.email.value.trim();
	var phone = form.phone.value.trim();

	API.register(
	    username,
	    password,
	    fullname,
	    email,
	    phone,
	    function(xml) {
		$.each(
		    $(xml).find('user'), 
		    function() {
			switch($(this).attr('result')) {
			case '1':
			    Debug.log("Username already exists");
			    $(form).find('.error-span').css('display', 'block');
			    break;
			case '2':
			    Debug.log("Invalid username");
			    break;
			case '3':
			    Debug.log("Invalid name, username or password");
			    break;
			case '4':
			    Debug.log("Invalid email");
			    break;
			case '5':
			    Debug.log("Invalid password");
			    break;
			case '6': 
			    Debug.log("Invalid phone number");
			    break;
			default:
			    Debug.log("Unknown error encountered");
			}
		    }
		);
	    }

	);
    }

});
