angular.module('ifiske.models')
.provider('Area', [
    function AreaProvider() {
        this.members = {
            ID:    'int',
            orgid: 'int',
            t:     'text',
            kw:    'text',
            note:  'text',
            c1:    'int',
            c2:    'int',
            c3:    'int',
            m1:    'int',
            m2:    'int',
            m3:    'int',
            lat:   'real',
            lng:   'real',
            zoom:  'text',
            pnt:   'int',
            car:   'int',
            eng:   'int',
            hcp:   'int',
            map:   'text',
            wsc:   'int',
            mod:   'int',
            d:     'text',
            ptab:  'text',
        };
        this.primary = 'ID';

        this.$get = [
            'API',
            'DB',
            function(API, DB) {
                return {
                    /**
                    * Gets information about an area
                    * @method getArea
                    * @param {Integer} id
                    */
                    getArea: function(id) {
                        return DB.getSingle([
                            'SELECT Area.*, Organization.t AS org,',
                            'CASE WHEN User_Favorite.ID IS NULL THEN 0 ELSE 1 END as favorite',
                            'FROM Area',
                            'LEFT JOIN User_Favorite ON User_Favorite.a = Area.ID',
                            'JOIN Organization ON Area.orgid = Organization.ID',
                            'WHERE Area.ID = ?',
                        ].join(' '), Array.isArray(id) ? id : [id]);
                    },

                    getAreaPhotos: function(aid) {
                        return DB.getMultiple([
                            'SELECT Area_Photos.*',
                            'FROM Area_Photos',
                            'WHERE Area_Photos.aid = ?',
                        ].join(' '), [aid]);
                    },

                    getAreaFishes: function(aid) {
                        return DB.getMultiple([
                            'SELECT *',
                            'FROM Area_Fish',
                            'JOIN Fish ON Area_Fish.fid = Fish.ID',
                            'WHERE Area_Fish.aid = ?',
                        ].join(' '), [aid]);
                    },

                    /**
                    * Searches the database using a query
                    *
                    * The query is matched to a name and/or keyword
                    * @method search
                    * @param {String} searchstring
                    */
                    search: function(searchstring, county_id) {
                        return DB.getMultiple([
                            'SELECT Area.*, Organization.t AS org, Organization.logo AS logo,',
                            'CASE WHEN User_Favorite.ID IS NULL THEN 0 ELSE 1 END as favorite',
                            'FROM Area',
                            'LEFT JOIN User_Favorite ON User_Favorite.a = Area.ID',
                            'JOIN Organization ON Organization.ID = Area.orgid',
                            'WHERE ((Area.t LIKE ?) OR (Organization.t LIKE ?))',
                            (county_id ? 'AND ? IN (c1,c2,c3)' : ''),
                            'ORDER BY Organization.t',
                        ].join(' '),
                        county_id ?
                        ['%' + searchstring + '%', '%' + searchstring + '%', county_id] :
                        ['%' + searchstring + '%', '%' + searchstring + '%']);
                    },
                };
            },
        ];
    },
]);
