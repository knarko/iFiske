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
		$("#content").html(template());
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
