var API_URL			= "https://www.ifiske.se/index.php";
var STATUS_TIME	= "timeStamp";
var STATUS_LOGIN	= "loggedIn";
function login(user, password) {
	//TODO: Add status update to frontend
	$.ajax( {
		url: API_URL,
		data: {
			option:		"com_ifiskeapi",
			view:			"api",
			format:		"raw",
			action:		"get_user_subscriptions",
			uid:			user,
			pw:			password
		},
		dataType: "xml",
		success: function(e){
			message = $(e).find('error').html();
			if(message == undefined){
				message = "Successfully logged in!";
			}
			alert(message);
			localStorage.user = user;
			localStorage.password = password;
		},
		error: function(e) {
			console.log(e);
			alert(e.status + ": " + e.statusText);
		}
	})
}

function logout() {
	delete localStorage.user;
	delete localStorage.password;
}

function parse(xml_response)
{
	$(xml_response).find("subscription").each(function() {
		//TODO: fixus everythingus
		$.each(this.attributes, function(i ,attrib) {
			localStorage.setItem(attrib.name, $(this).attr(attrib.name));
		})
	})
	localStorage.setItem(STATUS_TIME, new Date().getTime());
	localStorage.setItem(STATUS_LOGIN, true);
}
