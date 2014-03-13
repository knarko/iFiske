
/** API
 * Functions managing API requests.
 */
var API = Object.freeze( {
    /** request
     * Sends API requests
     * args:          Hash containing request arguments (name -> value)
     * success_func:  Function to be called on request success
     *
     * Notes:
     * - Due to inconsistent server-side error handling we cannot check for
     * server-side errors here. All error handling should be placed inside
     * success_func.
     **/
    request: function(args, success_func)
    {
	args.option = 'com_ifiskeapi';
	args.view = 'api';
	args.format = 'raw';

	$.ajax( {
	    url: 'https://www.ifiske.se/index.php',
	    dataType: "xml",
	    data: args,
	    success: success_func,
	    error: function(e) {
		console.log(e);
	    }
	});
    },

    /**
     * auth_request
     * Convenience method wrapper for requests requiring authentication
     **/
    auth_request: function(args, success_func)
    {
	args.uid = localStorage.getItem('user');
	args.pw = localStorage.getItem('password');
	api_request(args, success_func);
    }
});
