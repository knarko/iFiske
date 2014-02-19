/*
 * This is mainly a draft. I'm not sure if this is a proper way to do it. Please change everything to something better.
 * Navigation system for the app
 * context is an object containing all that we need to recreate the view
 * context does also contain the target.
 */
Navigate = {};
Navigate.init = function(){
	localStorage.navigation = [];
	var template = Handlebars.getTemplate("start");
	history.pushState({"path": "start"},null,"#TODO");
	history.pushState({"path": "start"},null,"#TODO");
	$("#content").html(template());
};

Navigate.to = function(target){ //,context){
	//Save context
	history.pushState({"path": target},null,"#TODO");
	//Load handlebar template
	template = Handlebars.getTemplate(target);
	//display page
	$("#content").html(template());
};

Navigate.back = function(e){
	if(e.state == null)
		return 1;
	//Get target context
	console.log(e);
	//Load handlebar template
	template = Handlebars.getTemplate(e.state.path);
	//display page
	$("#content").html(template());
};
