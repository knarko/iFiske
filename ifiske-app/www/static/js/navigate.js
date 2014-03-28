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
        this.navigate('start');

        Database.init();
        Database.testUpdater();
    },

    /** to
     * Navigates to target template and adds history entry.
     * target:    Name of screen to load
     * context:   Hash containing variables for target template (optional)
     */
    to: function(target, context) {
        history.pushState({path: target, context: context}, null, '#'+target);

        this.navigate(target, context);
        return false;
    },
    /** back
     * Navigates to previous history entry
     * e:    history entry to navigate to
     */
    back: function(e) {
        if(e.state != null){
            this.closePopup();
            this.navigate(e.state.path, e.state.context);
        }
    },

    /** navigate
     * target:
     * context:
     */
    navigate: function(target, context) {
        target = Handlebars.getTemplate(target);
        $('#content').html(target($.extend({}, localStorage, context || {})));
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
