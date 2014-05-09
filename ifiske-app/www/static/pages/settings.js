var settings = Object.freeze({
    go: function () {
        Navigate.to('settings', this.onload);
    },
    onload: function (text) {

    },

    logout: function() {
        localStorage.removeItem('user');
        localStorage.removeItem('password');

        // Avoid back stack entry
        Navigate.init();
    },
    force_update: function () {
        localStorage.setItem('db_updated', 1);
        Database.update();
    }
});
