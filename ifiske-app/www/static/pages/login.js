var login = Object.freeze({
    go: function () {
        Navigate.to('login', this.onload);
    },
    onload: function (text) {

    },
    auth: function (form) {
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
                // Avoid back stack entry
                Navigate.init();
            });
    }
});
