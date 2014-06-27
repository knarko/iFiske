/**
 * base class for pages
 * @class Page
 */

/**
 * Navigates to the page
 * @method go
 * @param {Integer} id
 */

/**
 * Called when done loading
 * @method onload
 * @param {String} text
 * @param {Integer} id
 * @return
 */

/**
 * @class start
 * @extends Page
 * @module Pages
 */
var start = Object.freeze({
    go: function () {
        Navigate.to('start', this.onload)
    },
    onload: function(text) {
        if(localStorage.user) {
            $(text).find('.logged-in, .not-logged-in').toggle();
            $(text).find('.username').text(localStorage.user);
        }
    }
});
