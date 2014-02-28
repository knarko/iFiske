
function infoClick() {
	if ($("#content").find("#about").length == 0) {
		$("#content").prepend("<div id=about></div>");
		$("#about").load("about.html");
	}
	
	$('html').prepend("<div id=filter onclick=filterClick()></div>")
	$("#filter").fadeIn("fast", "linear");
	showAbout();
}

function filterClick() {
	$("#filter").fadeOut("fast", "linear");
	showAbout();	
	$("#filter").remove();
}


function showAbout() {
	if ($("#info").attr("value") == "hidden") {
		$("#about").fadeIn("slow", "linear");
		$("#info").attr("value", "showing");
	} else if ($("#info").attr("value") == "showing") {
		$("#about").fadeOut("fast", "linear");
		$("#info").attr("value", "hidden");
	}
}