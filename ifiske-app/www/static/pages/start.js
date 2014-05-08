var Start = Object.freeze({
    go: function () {
        Navigate.to('start', this.onload)
    },
    onload: function(text) {
        if(localStorage.user)
            $(text).find('.logged-in, .not-logged-in').toggle();
    }
});
