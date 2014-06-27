/**
 * app namespace
 * @class app
 * @module Globals
 */
var app = {
    /**
     * Application Constructor
     * @method initialize
     */
    initialize: function() {
        this.bindEvents();
    },
    /**
     * Bind Event Listeners
     *
     * Bind any events that are required on startup. Common events are:
     * 'load', 'deviceready', 'offline', and 'online'.
     * @method bindEvents
     */
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    /**
    * deviceready Event Handler
    *
    * The scope of 'this' is the event. In order to call the 'receivedEvent'
    * function, we must explicity call 'app.receivedEvent(...);'
     * @method onDeviceReady
     */
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },

    /**
    * Update DOM on a Received Event
     * @method receivedEvent
     * @param {} id
     */
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        //listeningElement.setAttribute('style', 'display:none;');
        //receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    }
};

$(document).ready(function(){
    Navigate.init();
    window.addEventListener('popstate', function(e){
        Navigate.back(e);
    });
    $('#filter, #logo').click(history.back);
    $('#searchform').submit(search.go);
    Database.update();

    window.addEventListener("orientationchange", orientationChange, true);

});
var timeout;

/**
 * Opens a browser window to facebook
 * @method open_fb
 */
function open_fb() {
    window.open('https://www.facebook.com/fiskekort', '_system');
}

/**
 * Tries opening the facebook app, falls back to browser if failed.
 * @method try_open_fb
 */
function try_open_fb()
{
    window.open('fb://profile/215728895115467', '_system');
    timeout = setTimeout('open_fb()', 300);
}

function orientationChange(e) {
    var e = window.orientation;
    if (window.orientation == -90 || window.orientation == 90)
    {
        $("#popup").css('height', '70%');
    }
    else
    {
      $("#popup").css('height', '50%');
    }
}

