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

    register: function() {
        // TODO: NYI
    }
});
