/*
 * This is mainly a draft. I'm not sure if this is a proper way to do it. Please change everything to something better.
 * Navigation system for the app
 * context is an object containing all that we need to recreate the view
 * context does also contain the target.
 */
Navigate = {};
Navigate.init = function(){
	localStorage.navigation = [];
	var template = Handlebars.getTemplate(start);
	$("#content").html = template(default_context);
};

Navigate.to = function(target,context){
	//Save context
	localStorage.navigation.push(context);
	//Load handlebar template
	template = Handlebars.getTemplate(target);
	new_context = template.createDefaultContext();
	//display page
	$("#content").html = template(new_context);
};

Navigate.back = function(){
	//Get target context
	context = localStorage.navigation.pop();
	if(context == null)
		return;
	//Load handlebar template
	template = Handlebars.getTemplate(context.target);
	//display page
	$("#content").html = template(context);
};
