/*
 * Navigation system for the app
 * to go forward, call Navigate.to('target')
 * to back, call window.history.back()
 *
 * TODO: Make sure that more context are saved, so that we may restore lists on back
 */
Navigate = {};
Navigate.init = function(){
	var template = Handlebars.getTemplate("start");
	history.pushState({"path": "start"},null,"#INIT");
	history.pushState({"path": "start"},null,"#START");
	$("#content").html(template());
};

Navigate.to = function(target){
	//TODO: save more context
	history.pushState({"path": target},null,"#"+target);
	template = Handlebars.getTemplate(target);
	$("#content").html(template());
};

Navigate.back = function(e){
	if(e.state == null)
		return 1;
	template = Handlebars.getTemplate(e.state.path);
	$("#content").html(template());
	e.stopPropogation();
};
