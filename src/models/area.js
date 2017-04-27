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
                ID:   'int',
                area: 'int', // Area ID
                file: 'int', // File name
                t:    'text', // Title
                d:    'text', // Description
                h:    'int', // Height in pixels
                w:    'int', // Width in pixels
                org:  'int', // Organisation ID
                s:    'int', // Size in bytes
            },
        },
        {
            name:    'Area_Files',
            primary: 'ID',
            members: {
                ID:    'int',
                area:  'int',  // Area ID
                t:     'text', // File headline
                f:     'text', // Filename
                typ:   'text', // 3 letter file type (e.g. PDF)
                thumb: 'text', // Thumbnail
            },
        },
    ];

    this.$get = function($q, DB, API, $cordovaGeolocation) {
        var p = [];
        var fuse = $q.defer();
        var currentLocation, watch;

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
                return $q.all([
                    API.get('get_areas'),
                    API.get('get_images'),
                ]).then(function(data) {
                    if (shouldUpdate === 'skipWait')
                        return data;
                    return wait.then(function() {
                        return data;
                    });
                }).then(insert);
        }

        function insert(data) {
            var areas = data[0];
            var images = data[1];
            var fishArr = [];
            var filesArr = [];
            for (var key in areas) {
                var fishes = areas[key].fish;
                for (var fishKey in fishes) {
                    fishArr.push({
                        ID:      key + '_' + fishKey,
                        fid:     fishKey,
                        aid:     key,
                        amount:  fishes[fishKey][0],
                        comment: fishes[fishKey][1],
                    });
                }
                var files = areas[key].files.map(file => {
                    file.area = key;
                    return file;
                });
                filesArr.push(...files);
            }
            return $q.all([
                DB.populateTable(tables[0], areas),
                DB.populateTable(tables[1], fishArr),
                DB.populateTable(tables[2], images),
                DB.populateTable(tables[3], filesArr),
            ]);
        }

        var Area = {
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

            getAll: function getAll() {
                return wait.then(function() {
                    return DB.getMultiple([
                        'SELECT Area.*, Organization.t as org, Organization.d as org_d,',
                        'CASE WHEN User_Favorite.a IS NULL THEN 0 ELSE 1 END as favorite',
                        'FROM Area',
                        'LEFT JOIN User_Favorite ON User_Favorite.a = Area.ID',
                        'LEFT JOIN Organization ON Area.orgid = Organization.ID',
                    ].join(' '));
                });
            },

            getPhotos: function(areaId) {
                return wait.then(function() {
                    return DB.getMultiple([
                        'SELECT Area_Photos.*',
                        'FROM Area_Photos',
                        'WHERE Area_Photos.area = ?',
                    ].join(' '), [areaId]).then(function(images) {
                        for (var i = 0; i < images.length; ++i) {
                            images[i].ratio = (images[i].h / images[i].w) * 100 + '%';
                        }
                        return images;
                    });
                });
            },

            getFiles: function(areaId) {
                return wait.then(function() {
                    return DB.getMultiple([
                        'SELECT Area_Files.*',
                        'FROM Area_Files',
                        'WHERE Area_Files.area = ?',
                    ].join(' '), [areaId]);
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
            search: function(searchstring) {
                var t0 = performance.now();
                if (!watch) {
                    watch = startWatch();
                }
                return fuse.promise.then(function(fuse) {
                    return $q(function(resolve) {
                        var res = fuse.search(searchstring);
                        if (currentLocation) {
                            res.forEach(r => {
                                r.score += mapDistance(calculateDistance(
                                    r.item.lat,
                                    r.item.lng,
                                    currentLocation.lat,
                                    currentLocation.lng
                                    ));
                            });
                        }
                        resolve(res.sort((a, b) => a.score - b.score).map(r => r.item));
                        var t1 = performance.now();
                        console.log('Searching took:', (t1 - t0), 'ms');
                    });
                });
            },
        };

        function startWatch() {
            watch = $cordovaGeolocation.watchPosition({
                timeout:            10000,
                enableHighAccuracy: false,
            });
            watch.then(null, err => console.warn(err), position => {
                currentLocation = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                };
            });
        }

        function mapDistance(val) {
            return Math.log(1 + val) / Math.log(1 + 1000000) / 100;
        }

        function calculateDistance(lat1, lon1, lat2, lon2) {
            // Implementation shamelessely stolen from http://www.movable-type.co.uk/scripts/latlong.html
            var R = 6371e3; // metres
            var φ1 = lat1 * (Math.PI / 180);
            var φ2 = lat2 * (Math.PI / 180);
            var Δφ = (lat2 - lat1) * (Math.PI / 180);
            var Δλ = (lon2 - lon1) * (Math.PI / 180);

            var a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
                Math.cos(φ1) * Math.cos(φ2) *
                Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
            var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

            return R * c;
        }

        Area.getAll().then(function(data) {
            var options = {
                keys: [{
                    name:   't',
                    weight: 0.8,
                },
                {
                    name:   'd',
                    weight: 0.5,
                },
                {
                    name:   'note',
                    weight: 0.4,
                },
                {
                    name:   'kw',
                    weight: 0.6,
                },
                {
                    name:   'org',
                    weight: 0.7,
                },
                {
                    name:   'org_d',
                    weight: 0.4,
                }],
                includeScore:     true,
                shouldSort:       false,
                threshold:        0.5,
                distance:         10,
                maxPatternLength: 16,
            };

            fuse.resolve(new Fuse(data, options));
        }, function(err) {
            console.warn(err);
        });

        return Area;
    };
});
