/**
 * @class settings
 * @extends Page
 * @module Pages
 */
var settings = Object.freeze({
    go: function () {
        Navigate.to('settings', this.onload);
    },
    onload: function (text) {
        if(localStorage.user) {
            $(text).find('.logged-in, .not-logged-in').toggle();
        }
    },

    /**
     * Logs out by removing username and password from localstorage
     * @method logout
     */
    logout: function() {
        var logout = function(){
            localStorage.removeItem('password');
            localStorage.removeItem('user');

            // Avoid back stack entry
            Navigate.init();
        }
        if(navigator.notification) {
            navigator.notification.confirm(
                'Är du säker på att du vill logga ut?',
                function(button){
                    if(button == 1)
                        logout();
                },
                'Logga ut',
                ['Ja','Nej']
            );

        } else {
            logout();
        }
    },
    /**
     * Forces an update
     * @method force_update
     */
    force_update: function () {
        if (navigator.notification) {
            navigator.notification.activityStop();
            navigator.notification.activityStart('Uppdaterar...', 'Laddar ned...');
        }
        localStorage.setItem('db_updated', 1);
        Database.update(function() {
            console.log('hi!');
            if(navigator.notification) {
                navigator.notification.activityStop();
                navigator.notification.alert("Intern databas uppdaterad", function(){},"Klar!");
            }
        },
        function (err) {
            if (navigator.notification) {
                navigator.notification.activityStop();
                navigator.notification.alert('Fel i anslutning till server', function(){},'Fel');
            } else {
                console.log(err);
            }
        });
    },
    /**
     * Links to bug report page
     * @method reportBug
     */
    reportBug: function () {
        navigator.app.loadUrl(
            'https://github.com/ifiske/ifiske/issues',
			{openExternal: true}
		    );
    }
});
