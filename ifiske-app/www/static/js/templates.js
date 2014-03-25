Handlebars.getTemplate = function(name){
    if(Handlebars.templates === undefined || Handlebars.templates[name] === undefined){
        $.ajax({
            url: 'static/templates/' + name + '.handlebars',
            success: function(data){
                if(Handlebars.templates === undefined){
                    Handlebars.templates = {};
                }
                Handlebars.templates[name] = Handlebars.compile(data);
            },
            async : false
        });
    }
    return Handlebars.templates[name];
};

Handlebars.registerHelper('list', function(items, options) {
	var out = "<ul>";
	for(var i=0, l=items.length; i<l; ++i){
		if (i % 2 != 0)
			out += "<li class=gray>" + options.fn(items[i]) + "</li>";
		else
			out += "<li>" + options.fn(items[i]) + "</li>";
	}
	return out + "</ul>";
});

Handlebars.registerHelper('button', function(options){
    var h = options.hash;
    h.class = "button " + (h.class|| "");
    h.ontouchend = (h.ontouchend || "Navigate.to('" + h.target + "');");
    h.onclick = h.ontouchend;//Only for debugging in a web browser
    delete h.target;
    return $('<div/>', options.hash)[0].outerHTML;
});
