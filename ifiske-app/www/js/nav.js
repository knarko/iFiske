/*
 * This is mainly a draft. I'm not sure if this is a proper way to do it. Please change everything to something better.
 * Navigation system for the app
 * context is an object containing all that we need to recreate the view
 * context does also contain the target.
 */

var init = function(){
	localStorage.navigation = [];
};

var go = function(target,context){
	//Save context
	localStorage.navigation.push(context);
	//Load handlebar template
	template = Handlebars.getTemplate(target);
	new_context = template.createDefaultContext();
	//display page
	$("#content").html = template(new_context);
};

var back = function(){
	//Get target context
	context = localStorage.navigation.pop();
	//Load handlebar template
	template = Handlebars.getTemplate(context.target);
	//display page
	$("#content").html = template(context);
};
