var USER = Object.freeze( {

	login: function(user, password)
	{
		API.request(
						{
			action: 'login',
			uid: user,
			pw: password
		},
		function(e) {
			err = $(e).find('error')[0];

			if (err == null) {
				localStorage.setItem('user', user);
				localStorage.setItem('password', password);
				Navigate.to('start');
			} else {
				//Handle failed login
				console.log("Login error code: " + err.getAttribute('id'));
			}
		}
					  );
	},

	logout: function()
	{
		localStorage.removeItem('user');
		localStorage.removeItem('password');
	},

	register: function()
	{
		// TODO: NYI
	}
});


/*
	var STATUS_TIME	= "timeStamp";
	var STATUS_LOGIN = "loggedIn";


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
}*/
