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
        Start.go();
    },

    /** to
     * Navigates to target template and adds history entry.
     * target:    Name of screen to load
     * context:   Hash containing variables for target template (optional)
     */
    to: function(target, callback) {
        history.pushState({path: target}, null, '#'+target);
        this.navigate(target, callback);
    },

    /** back
     * Navigates to previous history entry
     * e:    history entry to navigate to
     */
    back: function(e) {
        if(e.state != null){
            this.closePopup();
            this.navigate(e.state.path, e.state.callback);
        }
    },

    /** navigate
     *
     * target:
     * context:
     */
    navigate: function(target, callback) {
        var a = document.createElement('div');
        $(a).load('static/pages/' + target + '.html', function() {
            callback(a);
        });
        $('#content').html(a);
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
