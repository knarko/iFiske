angular.module('ifiske.models')
.provider('Area', function AreaProvider() {
    var tables = [
        {
            name:    'Area',
            members: {
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
            },
            primary: 'ID',
        },
        {
            name:    'Area_Fish',
            members: {
                ID:      'text',
                aid:     'int',
                fid:     'int',
                amount:  'int',
                comment: 'text',
            },
            primary: 'ID',
        },
        {
            name:    'Area_Photos',
            members: {
                ID:  'text',
                aid: 'int',
                url: 'int',
            },
            primary: 'ID',
        },
    ];

    this.$get = function($q, DB, API) {
        var p = [];
        for (var i = 0; i < tables.length; ++i) {
            p.push(DB.initializeTable(tables[i]));
        }
        var wait = $q.all(p);

        wait.catch(function(err) {
            console.error(err);
        });

        function insert(data) {
            var fishArr = [];
            var photoArr = [];
            for (var key in data) {
                var fishes = data[key].fish;
                for (var fishKey in fishes) {
                    fishArr.push({
                        ID:      key + '_' + fishKey,
                        fid:     fishKey,
                        aid:     key,
                        amount:  fishes[fishKey][0],
                        comment: fishes[fishKey][1],
                    });
                }
                var photos = data[key].imgs;
                if (photos) {
                    for (var i = 0; i < photos.length; ++i) {
                        photoArr.push({
                            ID:  key + '_' + i,
                            aid: key,
                            url: photos[i],
                        });
                    }
                } else {
                    console.log(key);
                }
            }
            return $q.all([
                DB.populateTableNew(tables[0], data),
                DB.populateTableNew(tables[1], fishArr),
                DB.populateTableNew(tables[2], photoArr),
            ])
            .then(function() {
                return 'Area';
            }, function(err) {
                console.warn(err);
                return $q.reject(err);
            });
        }

        return {
            /**
            * Updates all tables
            */
            update: function() {
                return API.get('get_areas').then(function(data) {
                    return wait.then(function() {
                        return data;
                    });
                }).then(insert);
            },

            /**
            * Fetches a single Area
            * @param {Integer} id - ID for the requested area
            * @return {Promise<Area>} - A promise for the requested area
            */
            getOne: function getOne(id) {
                return wait.then(function() {
                    console.log('hello');
                    return DB.getSingle([
                        'SELECT Area.*, Organization.t AS org,',
                        'CASE WHEN User_Favorite.ID IS NULL THEN 0 ELSE 1 END as favorite',
                        'FROM Area',
                        'LEFT JOIN User_Favorite ON User_Favorite.a = Area.ID',
                        'JOIN Organization ON Area.orgid = Organization.ID',
                        'WHERE Area.ID = ?',
                    ].join(' '), Array.isArray(id) ? id : [id]);
                });
            },

            getPhotos: function(aid) {
                return wait.then(function() {
                    return DB.getMultiple([
                        'SELECT Area_Photos.*',
                        'FROM Area_Photos',
                        'WHERE Area_Photos.aid = ?',
                    ].join(' '), [aid]);
                });
            },

            getFishes: function(aid) {
                return wait.then(function() {
                    return DB.getMultiple([
                        'SELECT *',
                        'FROM Area_Fish',
                        'JOIN Fish ON Area_Fish.fid = Fish.ID',
                        'WHERE Area_Fish.aid = ?',
                    ].join(' '), [aid]);
                });
            },

            /**
            * Searches the database using a query
            *
            * The query is matched to a name and/or keyword
            * @method search
            * @param {String} searchstring - a string to search for  in the area or organization names
            * @param {Integer} countyID - ID for a county to filter on
            * @return {Promise<Area[]>} Promise for the matching areas
            */
            search: function(searchstring, countyID) {
                return wait.then(function() {
                    return DB.getMultiple([
                        'SELECT Area.*, Organization.t AS org, Organization.logo AS logo,',
                        'CASE WHEN User_Favorite.ID IS NULL THEN 0 ELSE 1 END as favorite',
                        'FROM Area',
                        'LEFT JOIN User_Favorite ON User_Favorite.a = Area.ID',
                        'JOIN Organization ON Organization.ID = Area.orgid',
                        'WHERE ((Area.t LIKE ?) OR (Organization.t LIKE ?))',
                        (countyID ? 'AND ? IN (c1,c2,c3)' : ''),
                        'ORDER BY Organization.t',
                    ].join(' '),
                    countyID ?
                    ['%' + searchstring + '%', '%' + searchstring + '%', countyID] :
                    ['%' + searchstring + '%', '%' + searchstring + '%']);
                });
            },
        };
    };
});
