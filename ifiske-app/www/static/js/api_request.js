
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
            dataType: 'xml',
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
    },
    /**
     * getAreas
     * Gets all areas and calls a callback with the resulting object
     * callback: A function accepting an Object containing regions and areas as input
     **/
    getAreas: function(callback) {
        var requestCallback = function(xmldata) {
            if (xmldata != null) {
                callback(API.xmlparser(xmldata));
            }
        }
        API.request({action: "get_areas"}, requestCallback);
    },
    xmlparser: function(xmldata) {
        var regions   = [],
        areas         = [],
        organisations = [];
        area_keywords = [];

        if($(xmldata).find('user_areas')){

            $.each(
                $(xmldata).find('user_areas').children(),
                function() {
                    regions.push([
                        parseInt($(this).attr('id')),
                        $(this).attr('name'),
                        parseFloat($(this).attr('long')),
                        parseFloat($(this).attr('lat')),
                        parseInt($(this).attr('quantity'))
                    ]);

                    $.each(
                        $(this).children(),
                        function() {
                            areas.push([
                                parseInt($(this).attr('id')),
                                $(this).attr('name'),
                                parseInt($(this).attr('regID')),
                                parseInt($(this).attr('orgID')),
                                parseFloat($(this).attr('long')),
                                parseFloat($(this).attr('lat'))
                            ]);
                            var id = $(this).attr('id');
                            if($(this).attr('keywords') != ""){
                                var keywords = $(this).attr('keywords').split(', ');
                                for (var i in keywords) {
                                    console.log(keywords[i]);
                                    area_keywords.push([id,keywords[i]]);
                                }
                            }
                        }
                    );

                }
            );
            return {regions: regions, areas: areas, area_keywords: area_keywords};
        } else {
            return false;
        }
    }
});
