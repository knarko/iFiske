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
                    $(form).find('.error-span').css('display', 'block');
                    return;
                }
                localStorage.setItem('user', user);
                localStorage.setItem('password', password);
                //Fetch all user subscriptions
                API.getSubscriptions(function(data) {
                    Database.updateTable('Subscriptions', data);
                });
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
	var pwc = e.parentNode.password_confirm;

	if (pwc.value.trim() !== "" &&
	    pwc.value.trim() !== e.parentNode.password.value.trim()) {
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
			    console.log("Username already exists");
			    $(form).find('.error-span').css('display', 'block');
			    break;
			case '2':
			    console.log("Invalid username");
			    break;
			case '3':
			    console.log("Invalid name, username or password");
			    break;
			case '4':
			    console.log("Invalid email");
			    break;
			case '5':
			    console.log("Invalid password");
			    break;
			case '6':
			    console.log("Invalid phone number");
			    break;
			default:
			    console.log("Unknown error encountered");
			}
		    }
		);
	    }

	);
    }

});
