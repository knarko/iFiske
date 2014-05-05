
function expand() {
		$("#search-div").prepend('<form id="searchform" onsubmit="Search.go($("#searchfield").val());return false;">' + 
	     	'<input id="searchfield" type="search" placeholder="Snabbsök"/>' + 
	    	'<div id="search-bottom-bar"></div>' + 
	    	'<button type="submit" style="visibility: hidden"/>' + 
			'</form>')

		$("#searchfield").stop().animate({width: 'toggle'}, "slow", "linear");
		$("#search-bottom-bar").slideToggle("slow");
}