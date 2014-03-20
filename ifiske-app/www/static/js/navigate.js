/**
 * Navigation system for the app
 * to go forward, call Navigate.to('target')
 * to back, call window.history.back()
 */
var Navigate = Object.freeze({
    /** init
     * Initial app state. Loads start screen and adds initial history entry.
     */
    init: function() {
        history.replaceState({path: 'start'}, null, '#');
        this.navigate('start');
    },

	to: function(target){
		//TODO: save more context
		history.pushState({"path": target},null,"#"+target);
		template = Handlebars.getTemplate(target);
		if (target == "search")
		{
			var items = {
    "waters": [
        {
            "name": "Bräkneån",
            "region": "Blekinge Län"
        },
        {
            "name": "Listersjön",
            "region": "Blekinge Län"
        },
        {
            "name": "Ljusterhövden",
            "region": "Blekinge Län"
        },
        {
            "name": "Barkensjöarnas FVOF",
            "region": "Dalarnas Län"
        },
        {
            "name": "Bjursås-Leksands FVOF",
            "region": "Dalarnas Län"
        },
        {
            "name": "Hinsen-Logärdens FVOF",
            "region": "Dalarnas Län"
        },
        {
            "name": "Leksand Insjön",
            "region": "Dalarnas Län"
        },
        {
            "name": "Runn",
            "region": "Dalarnas Län"
        },
        {
            "name": "Rättvik Boda",
            "region": "Dalarnas Län"
        },
        {
            "name": "Siljan",
            "region": "Dalarnas Län"
        },
        {
            "name": "Siljans Södra FVO",
            "region": "Dalarnas Län"
        },
        {
            "name": "Skäftringen",
            "region": "Dalarnas Län"
        },
        {
            "name": "Säter",
            "region": "Dalarnas Län"
        },
        {
            "name": "Vikasjön & Runn",
            "region": "Dalarnas Län"
        },
        {
            "name": "Väsman",
            "region": "Dalarnas Län"
        },
        {
            "name": "Abborrtjärn",
            "region": "Gävleborgs Län"
        },
        {
            "name": "Arbrås fvf Brickörvattnet",
            "region": "Gävleborgs Län"
        },
        {
            "name": "Byströmmen",
            "region": "Gävleborgs Län"
        },
        {
            "name": "Galvsjön",
            "region": "Gävleborgs Län"
        },
        {
            "name": "Harmångers Fiskeområde",
            "region": "Gävleborgs Län"
        },
        {
            "name": "Ljusdals",
            "region": "Gävleborgs Län"
        },
        {
            "name": "Ränningen",
            "region": "Gävleborgs Län"
        },
        {
            "name": "Undersviks",
            "region": "Gävleborgs Län"
        },
        {
            "name": "Voxnan, Storhamrasjön och en massa andra fiskebestånd och fiskeområden som inte kartläggs",
            "region": "Gävleborgs Län"
        },
        {
            "name": "Vänneå",
            "region": "Hallands Län"
        },
        {
            "name": "Storsjön",
            "region": "Hela Sverige"
        },
        {
            "name": "Rasken",
            "region": "Ingenstans"
        }
    ]
}



			$("#content").html(template(items));
		}
		else
		{
			$("#content").html(template());
		}
	},

    /** back
     * Navigates to previous history entry
     * e:    history entry to navigate to
     */
    back: function(e) {
        if(e.state != null){
            this.closePopup();
            this.navigate(e.state.path, e.state.context);
        }
    },

    /** navigate
     *
     * target:
     * context:
     */
    navigate: function(target, context) {
        target = Handlebars.getTemplate(target);
        $('#content').html(target($.extend({}, localStorage, context || {})));
    },
    /** popup
     * Spawns a popup containing target template.
     * target:    template to popup
     */
    popup: function(target) {
        history.pushState({path: 'popup'}, null, '#popup');
        $('#popup').html(Handlebars.getTemplate(target)());
        $('#filter, #popup').fadeIn('fast', 'linear');
    },
    closePopup: function() {
        $('#filter, #popup').fadeOut('fast', 'linear');
    }
});
