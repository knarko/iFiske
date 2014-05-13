var settings = Object.freeze({
    go: function () {
        Navigate.to('settings', this.onload);
    },
    onload: function (text) {
        if(localStorage.user) {
            $(text).find('.logged-in, .not-logged-in').toggle();
        }
    },

    logout: function() {
        localStorage.removeItem('user');
        localStorage.removeItem('password');

        // Avoid back stack entry
        Navigate.init();
    },
    force_update: function () {
        navigator.notification.activityStart('Uppdaterar...', 'Laddar ned...');
        localStorage.setItem('db_updated', 1);
        Database.update(function() {
            navigator.notification.activityStop();
            navigator.notification.alert("Intern databas uppdaterad", function(){},"Klar!");
        });
    }
});
