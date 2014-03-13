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
	history.replaceState({"path": "start"}, null, "#");
	this.navigate("start");

	//TODO: FUGLY
	$("#filter").click(function(){
	    $("#filter #popupdiv").fadeOut("fast", "linear").off('click');
	}).off('click');

    },

    /** to
     * Navigates to target template and adds history entry.
     * target:    Name of screen to load
     * context:   Hash containing variables for target template (optional)
     */
    to: function(target, context) {
	history.pushState({"path": target, context: context},
			  null, "#"+target);
	this.navigate(target, context);
    },

    /** back
     * Navigates to previous history entry
     * e:    history entry to navigate to
     */
    back: function(e) {
	if(e.state == null)
	    return;
	this.navigate(e.state.path, e.state.context);
    },
    
    /** navigate
     * 
     * target:    
     * context:   
     */
    navigate: function(target, context) {
	target = Handlebars.getTemplate(target);
	$("#content").html(target($.extend({}, localStorage, context || {})));
    },

    /** popup
     * Spawns a popup containing target template. 
     * target:    template to popup
     */
    popup: function(target) {
	var popupdiv = $("#popup");
	popupdiv.html(Handlebars.getTemplate(target)());

	var filter = $("#filter");
	filter.on('click');
	filter.fadeIn("fast", "linear");
	popupdiv.fadeIn("fast", "linear");
    }
});
