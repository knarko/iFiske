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
        start.go();
    },

    /** to
     * Navigates to target template and adds history entry.
     * target:    Name of screen to load
     * context:   Hash containing variables for target template (optional)
     */
    to: function(target, callback, args) {
        history.pushState({path: target, args: args}, null, '#'+target);
        //TODO: Save callback and args for back/forward
        this.navigate(target, callback, args);
    },

    /** back
     * Navigates to previous history entry
     * e:    history entry to navigate to
     */
    back: function(e) {
        if(e.state != null){
            this.closePopup();
            //TODO: Get callback and args from historystack
            this.navigate(e.state.path, window[e.state.path].onload, e.state.args);
        }
    },

    /** navigate
     *
     * target:
     * context:
     */
    navigate: function(target, callback, args) {
        console.log(target);
        console.log(callback);
        console.log(args);
        var newContent = document.createElement('div');
        newContent.id = target;
        args = args || [];
        args.unshift(newContent);
        $(newContent).load('static/pages/' + target + '.html', function() {
            callback.apply(this, args);
        });
        $('#content').html(newContent);
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
