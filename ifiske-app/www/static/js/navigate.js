/*
 * Navigation system for the app
 * to go forward, call Navigate.to('target')
 * to back, call window.history.back()
 *
 * TODO: Make sure that more context are saved, so that we may restore lists on back
 * TODO: Render all templates with a context
 */
Navigate = Object.freeze({
	init: function(){
		var template = Handlebars.getTemplate("start");
		history.replaceState({"path": "start"},null,"#");
		$("#content").html(template());
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

	back: function(e){
		if(e.state == null)
			return;
		console.log(e);
		template = Handlebars.getTemplate(e.state.path);
		$("#content").html(template());
	},

	popup: function(target) {
		var popupdiv = $("#popup");
		popupdiv.html(Handlebars.getTemplate(target)());

		var filter = $("#filter");
		filter.click(function(){
			popupdiv.fadeOut("fast", "linear");
			filter.fadeOut("fast", "linear");
		});

		filter.fadeIn("fast", "linear");
		popupdiv.fadeIn("fast", "linear");
	}

});
