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
    },

    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');
        //$("#links").css("bottom", $("#footer").innerHeight());


        //listeningElement.setAttribute('style', 'display:none;');
        //receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    }
};

$(document).ready(function(){
    //TODO: Move all partials to js/templates
    Handlebars.registerPartial('header', $(Handlebars.getTemplate('partials')()).filter('#header-partial').html().trim());
    //Handlebars.registerPartial('footer', $(Handlebars.getTemplate('partials')()).filter('#footer-partial').html().trim());
    Navigate.init();
    window.addEventListener('popstate', function(e){
        Navigate.back(e);
    });
    Database.update();


    /*$("#facebook").click(function() {
        window.open('fb://profile/215728895115467', '_system');  
        alert("gets here");            
        window.open('https://www.facebook.com/fiskekort', '_system');   
        alert("gets here 2");
    })*/
    
});
var timeout;

function open_fb() {
    window.open('https://www.facebook.com/fiskekort', '_system');
}

function try_open_fb() 
{
    window.open('fb://profile/215728895115467', '_system');
    timeout = setTimeout('open_fb()', 300);
}
/* <a href="#" onclick="window.open('fb://profile/215728895115467', '_system');">
      <button class="img" id="facebook" />
    </a>*/
