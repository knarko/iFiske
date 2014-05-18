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
        var logout = function(){
            localStorage.removeItem('user');
            localStorage.removeItem('password');

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
    reportBug: function () {
        navigator.app.loadUrl(
            'https://github.com/ifiske/ifiske/issues/new',
			{openExternal: true}
		    );
    }
});
