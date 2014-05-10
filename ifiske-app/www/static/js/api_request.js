
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
     * any server-side errors here. All error messages/codes in the returned
     * xml should be handled in the callback function.
     * - Use auth_request for requests requiring authentication data if the
     * user is already logged in.
     **/
    request: function(args, callback)
    {
        args.option = 'com_ifiskeapi';
        args.view = 'api';
        args.format = 'raw';

        $.ajax( {
            url: 'https://www.ifiske.se/index.php',
            dataType: 'xml',
            data: args,
            success: callback,

            error: function(e) {
                console.log(e);
            }
        });
    },

    /** auth_request
     * Convenience method wrapper for requests requiring authentication
     **/
    auth_request: function(args, callback)
    {
        args.uid = localStorage.getItem('user');
        args.pw = localStorage.getItem('password');
        this.request(args, callback);
    },

    /** getAreas
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

    getPhotos: function(org_id, callback) {
        var requestCallback = function(xmldata) {
            if (xmldata != null) {
                callback(API.xmlparser(xmldata));
            }
        }
        API.request({action: "get_files", org: org_id}, requestCallback);
    },

    getOrganisations: function(callback) {
        var requestCallback = function(xmldata) {
            if (xmldata != null) {
                callback(API.xmlparser(xmldata));
            }
        }
        API.request({action: "get_organisations"}, requestCallback);
    },

    getUpdates: function(callback) {
        var requestCallback = function(xmldata) {
            if (xmldata != null) {
                callback(API.xmlparser(xmldata));
            }
        }
        API.request({action: "get_db_lastmod"}, requestCallback);
    },

    getSubscriptions: function(callback) {
        var requestCallback = function(xmldata) {
            if (xmldata != null)
                callback(API.xmlparser(xmldata));
        }
        API.request({
            action:  'get_subscriptions',
            uid:     localStorage.getItem('user'),
            pw:      localStorage.getItem('password')
        },
        requestCallback);
    },

    xmlparser: function(xmldata) {
        //TODO: Use Database.tableDefinition
        var
        regions       = [],
        areas         = [],
        organisations = [],
        area_keywords = [],
        products      = [],
        photos        = [],
        subscriptions = [];

        if ($(xmldata).find('user_areas').length != 0) {

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
                                parseFloat($(this).attr('lat')),
                                $(this).text().trim()
                            ]);
                            kitten = $(this);
                            var id = $(this).attr('id');
                            if($(this).attr('keywords') != ""){
                                var keywords = $(this).attr('keywords').split(', ');
                                for (var i in keywords) {
                                    area_keywords.push([id,keywords[i]]);
                                }
                            }
                            $.each(
                                $(this).children('products').children(),
                                function() {
                                    products.push([
                                        parseInt($(this).attr('ID')),
                                        parseInt($(this).attr('SMSdisplay')),
                                        parseInt($(this).attr('vat')),
                                        parseInt($(this).attr('saleschannel')),
                                        parseInt($(this).attr('areaID')),
                                        $(this).attr('name'),
                                        parseInt($(this).attr('price')),
                                        parseInt($(this).attr('ruleid')),
                                        parseInt($(this).attr('sortorder')),
                                        $(this).attr('headline'),
                                        $(this).attr('important'),
                                        $(this).attr('notes'),
                                        $(this).attr('SMSCode')
                                    ]);
                                }
                            );
                        }
                    );

                }
            );
            return {regions: regions, areas: areas, area_keywords: area_keywords, products: products};

        } else if($(xmldata).find('last_modification').length != 0){
            return parseInt($(xmldata).find('last_modification').attr('timestamp'));

        } else if ($(xmldata).find('organisations').length != 0) {
            $.each(
                $(xmldata).find('organisations').children(),
                function() {
                    organisations.push([
                        parseInt($(this).attr('id')),
                        $(this).attr('title'),
                        parseInt($(this).attr('lan')),
                        $(this).attr('descr'),
                        $(this).attr('homepage'),
                        $(this).attr('contact')
                    ]);
                }
            );
            return organisations;

        } else if ($(xmldata).find('photos').length != 0) {
            $.each(
                $(xmldata).find('photos').children(),
                function() {
                    photos.push($(this).attr('src'));
                }
            );
            asdf = photos;
            return photos;

        } else if ($(xmldata).find('subscriptions').length != 0) {
            $.each(
                $(xmldata).find('subscriptions').children(),
                function() {
                    subscriptions.push([
                        parseInt($(this).attr('id')),
                        $(this).attr('title'),
                        $(this).attr('product_title'),
                        parseInt($(this).attr('orgid')),
                        parseInt($(this).attr('ruleID')),
                        parseInt($(this).attr('areaid')),
                        parseInt($(this).attr('validFrom')),
                        parseInt($(this).attr('validTo')),
                        $(this).attr('fullname'),
                        $(this).attr('email'),
                        parseInt($(this).attr('ref_our')),
                        parseInt($(this).attr('ref_their')),
                        parseInt($(this).attr('mobile')),
                        parseInt($(this).attr('code')),
                        $(this).attr('PDFid'),
                        parseInt($(this).attr('purchased_at')),
                    ]);
                }
            );
            return subscriptions;

        } else {
            return false;
        }
    },

    /** authenticate
    */
    authenticate: function(user, password, callback) {
        this.request(
            {
            action: 'authenticate',
            uid: user,
            pw: password
        },
        callback
        );
    },

    /** register
    */
    register: function(username, password, fullname, email, phone, callback) {
        API.request({
            action: 'user_register',
            username: username,
            password: password,
            fullname: fullname,
            email: email,
            phone: phone
        },
        callback
        );
    }
});
