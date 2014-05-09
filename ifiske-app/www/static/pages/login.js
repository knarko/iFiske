var login = Object.freeze({
    go: function () {
        Navigate.to('login', this.onload);
    },
    onload: function (text) {

    },
    auth: function (form) {
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
    }
});
