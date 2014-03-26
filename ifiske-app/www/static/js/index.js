var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicity call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
        //var db = window.openDatabase('test', '1.0', 'Test DB', 1000000);
    },

    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        //listeningElement.setAttribute('style', 'display:none;');
        //receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    }
};

    //TODO: Implement general search function 
var search = function(thing){
    console.log('in search');
    return false;
}

$(document).ready(function(){
    //TODO: Move all partials to js/templates
    Handlebars.registerPartial('header', $(Handlebars.getTemplate('partials')()).filter('#header-partial').html().trim());
    //Handlebars.registerPartial('footer', $(Handlebars.getTemplate('partials')()).filter('#footer-partial').html().trim());
    Navigate.init();
    window.addEventListener('popstate', function(e){
        Navigate.back(e);
    });
});
