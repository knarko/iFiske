/**
 * Navigation system for the app
 * used by all pages to manage history and loading
 * use by calling Navigate.to('page', onloadfunc, [*args]);
 * to back, call window.history.back() which will be
 */
var Navigate = Object.freeze({
    /** init
     * Initial app state. Loads start screen and adds initial history entry.
     */
    init: function() {
        history.replaceState({path: 'start'}, null, '#');
        //TODO: Init start.go differently. Now it will call navigate.to, which will create a back stack entry.
        start.go();
    },

    /** to
     * Navigates to target template and adds history entry.
     * target: The target page to load into #content
     * callback: The callback to call when done
     * args: arguments for the callback
     */
    to: function(target, callback, args) {
        history.pushState({path: target, args: args}, null, '#'+target);
        this.navigate(target, callback, args);
    },

    /** back
     * Navigates to previous history entry
     * e: History event
     */
    back: function(e) {
        if(e.state != null){
            this.closePopup();
            this.navigate(e.state.path, window[e.state.path].onload, e.state.args);
        }
    },

    /** navigate
     * Internal function used in Navigate to load a page and call neccessary callbacks
     * target: The target page to load into #content
     * callback: The callback to call when done
     * args: arguments for the callback
     */
    navigate: function(target, callback, args) {
        var newContent = document.createElement('div');
        newContent.id = target;
        args = args || [];
        args.unshift(newContent);
        $(newContent).load('pages/html/' + target + '.html', function() {
            callback.apply(this, args);
        });
        $('#content').html(newContent);
    },

    /** popup
     * Spawns a popup containing target template.
     * target: Page to popup
     * callback: The callback to call when done
     * args: Arguments for the callback
     */
    popup: function(target, callback, args) {
        callback = callback || function(){};
        args = args || [];
        history.pushState({path: 'popup'}, null, '#popup');
        $('#popup').load('pages/html/' + target + '.html', function() {
            callback.apply(this, args);
            $('#filter, #popup').fadeIn('fast', 'linear');
        });
    },
    closePopup: function() {
        $('#filter, #popup').fadeOut('fast', 'linear');
    }
});
