
function expand() {
		$("#search-div").prepend('<form id="searchform" onsubmit="Search.go($("#searchfield").val());return false;">' + 
	     	'<input id="searchfield" type="search" placeholder="Snabbsök"/>' + 
	    	'<div id="search-bottom-bar"></div>' + 
	    	'<button type="submit" style="visibility: hidden"/>' + 
			'</form>')

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