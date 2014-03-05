var API_URL = "https://www.ifiske.se/index.php";
var STATUS_TIME	= "timeStamp";
var STATUS_LOGIN = "loggedIn";
var USER = "user";
var PASSWORD = "password";

function login(user, password) {
    //TODO: Add status update to frontend
    $.ajax( {
	url: API_URL,
	data: {
	    option: "com_ifiskeapi",
	    view: "api",
	    format: "raw",
	    action: "login",
	    uid: user,
	    pw:	password
	},
	dataType: "xml",
	success: function(e) {
	    err = $(e).find('error')[0];

	    if (err == undefined) {
		localStorage[USER] = user;
		localStorage[PASSWORD] = password;
		Navigate.to('start');
	    } else {
		//Handle failed login
		console.log("Login error code: " + err.getAttribute('id'));
	    }
	},
	error: function(e) {
	    console.log(e);
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
