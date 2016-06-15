;(function(Ionic) {
    var ionicSettings = {
        "app_id": "46a4a954",
        "api_key": "c585f4bef49c39c934c2fa6c11225ddffa61068ce74546d7",
        "dev_push": !window.parent._cordovaNative, //true if browser, false on device
        "gcm_key": "196216212249"
    };
    console.log('initializing Ionic with settings: ', ionicSettings);
    Ionic.Core.init(ionicSettings);
})(Ionic);
