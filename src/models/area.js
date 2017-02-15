angular.module('ifiske.models')
.provider('Area', function AreaProvider() {
    var tables = [
        {
            name:    'Area',
            primary: 'ID',
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
        },
        {
            name:    'Area_Fish',
            primary: 'ID',
            members: {
                ID:      'text',
                aid:     'int',
                fid:     'int',
                amount:  'int',
                comment: 'text',
            },
        },
        {
            name:    'Area_Photos',
            primary: 'ID',
            members: {
                ID:  'text',
                aid: 'int',
                url: 'int',
            },
        },
    ];

    this.$get = function($q, DB, API) {
        var p = [];
        for (var i = 0; i < tables.length; ++i) {
            p.push(DB.initializeTable(tables[i]));
        }
        var wait = $q.all(p).then(function(results) {
            for (var i = 0; i < results.length; ++i) {
                if (results[i])
                    return update('skipWait');
            }
        });

        function update(shouldUpdate) {
            if (shouldUpdate)
                return API.get('get_areas').then(function(data) {
                    if (shouldUpdate === 'skipWait')
                        return data;
                    return wait.then(function() {
                        return data;
                    });
                }).then(insert);
        }

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
                    console.log('Area did not know what to do with: ', key);
                }
            }
            return $q.all([
                DB.populateTable(tables[0], data),
                DB.populateTable(tables[1], fishArr),
                DB.populateTable(tables[2], photoArr),
            ]);
        }

        return {
            update: update,

            /**
            * Fetches a single Area
            * @param {Integer} id - ID for the requested area
            * @return {Promise<Area>} - A promise for the requested area
            */
            getOne: function getOne(id) {
                return wait.then(function() {
                    return DB.getSingle([
                        'SELECT Area.*, Organization.t AS org,',
                        'CASE WHEN User_Favorite.a IS NULL THEN 0 ELSE 1 END as favorite',
                        'FROM Area',
                        'LEFT JOIN User_Favorite ON User_Favorite.a = Area.ID',
                        'LEFT JOIN Organization ON Area.orgid = Organization.ID',
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
                        'CASE WHEN User_Favorite.a IS NULL THEN 0 ELSE 1 END as favorite',
                        'FROM Area',
                        'LEFT JOIN User_Favorite ON User_Favorite.a = Area.ID',
                        'LEFT JOIN Organization ON Organization.ID = Area.orgid',
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
