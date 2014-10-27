/**
 * Navigation system for the app
 * used by all pages to manage history and loading
 * use by calling Navigate.to('page', onloadfunc, [*args]);
 * to back, call window.history.back() which will be
 * @class Navigate
 * @module Globals
 */
var Navigate = Object.freeze({
    /**
     * Initial app state. Loads start screen and adds initial history entry.
     * @method init
     */
    init: function() {
        history.replaceState({path: 'start'}, null, '#');
        //TODO: Init start.go differently. Now it will call navigate.to, which will create a back stack entry.
        start.go();
    },

    /**
     * Navigates to target template and adds history entry.
     * @method to
     * @param {String} target The target page to load into #content
     * @param {Function} callback
     * @param {Object} args arguments for the callback
     */
    to: function(target, callback, args) {
        history.pushState({path: target, args: args}, null, '#'+target);
        this.navigate(target, callback, args);
    },

    /**
     * Navigates to previous history entry
     * @method back
     * @param {Event} e History event
     */
    back: function(e) {
        if(e.state != null){
            this.closePopup();
            this.navigate(e.state.path, window[e.state.path].onload, e.state.args);
        }
    },

    /**
     * Internal function used in Navigate to load a page and call neccessary callbacks
     * @method navigate
     * @param {String} target The target page to load into #content
     * @param {Function} callback
     * @param {Object} args arguments for the callback
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

    /**
     * Spawns a popup containing target template.
     * @method popup
     * @param {String} target Page to popup
     * @param {Function} callback
     * @param {Object} args Arguments for the callback
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
    /**
     * Closes an open popup
     * @method closePopup
     */
    closePopup: function() {
        $('#filter, #popup').fadeOut('fast', 'linear');
    }
});

