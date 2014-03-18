var USER = Object.freeze({
    /**
     * login
     * Sends login API request
     * user:      username (API uid)
     * password:  password (API pw)
     */
    login: function(user, password) {
        API.request(
            {
            action: 'login',
            uid: user,
            pw: password
        },
        function(e) {
            // Locate XML error object
            err = $(e).find('error')[0];

            if (err == null) {
                localStorage.setItem('user', user);
                localStorage.setItem('password', password);
                // Avoids back stack entry
                Navigate.init();
            } else {
                // Handle failed login
                console.log('Login error code: ' + err.getAttribute('id'));
            }
        }
        );
    },

    logout: function() {
        localStorage.removeItem('user');
        localStorage.removeItem('password');
        Navigate.init();
    },

    /** register
     * Sends a registration API request. 
     * username: 
     * password: 
     * fullname: 
     * email: 
     * phone: 
     */
    register: function(username, password, fullname, email, phone) {
	
	username = username.trim();
	password = password.trim();
	fullname = fullname.trim();
	email = email.trim();
	phone = phone.trim();

	var invalid = false;

	if ((/^[a-z\d]{6,}$/i).test(username)) {
	    // Handle error
	    console.log("invalid username");
	    invalid = true;
	}
	if ((/^.{8,}$/).test(password)) {
	    // Handle error
	    console.log("invalid password");
	    invalid = true; 
	}
	if ((/^\d{8,}$/).test(phone)) {
	    // Handle error
	    console.log("invalid phone number");
	    invalid = true;
	}
	
	if (invalid) 
	    break;
		
	/*
	  API.request(
	    {
		action: 'user_register',
		username: username,
		password: password,
		fullname: fullname,
		email: email,
		phone: phone 
	    },
	    function(e) {
		console.log(e);
            }
        );
	*/
    }
});
