var register = Object.freeze({
    go: function () {
        Navigate.to('register', this.onload);
    },
    onload: function (text) {

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
        var
        username = form.username.value.trim(),
        password = form.password.value.trim(),
        fullname = form.fullname.value.trim(),
        email    = form.email.value.trim(),
        phone    = form.phone.value.trim();

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
                            //TODO: Print this shit
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
