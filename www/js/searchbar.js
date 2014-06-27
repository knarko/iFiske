function expand() {
		$("#search-div").prepend('<form onsubmit="search.go();return false;">' + 
            '<input id="searchfield" type="search" placeholder="Snabbsök"/>' +
            '<div id="search-bottom-bar"></div>' +
          '</form>' +
        '</div>')
		$("#searchfield").css('visibility', "visible");
		$("#search-icon").css('visibility', "hidden")

		$("#searchfield").stop().animate({width: 'toggle'}, {
			step: function() {
				$(this).css('-webkit-transform', "translate3d(0px, 0px, 0px)"); 
			},
			duration: 285 },
			"linear");
		
		$("#search-bottom-bar").slideToggle({
			duration: 300, 
			step: function() {
				$(this).css('-webkit-transform', "translate3d(0px, 0px, 0px)"); 
			}
		});
}