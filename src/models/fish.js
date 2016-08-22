angular.module('ifiske.models')
.provider('Fish', function AreaProvider() {
    var table = {
        name:    'Fish',
        primary: 'ID',
        members: {
            ID:   'int',
            t:    'text',
            d:    'text',
            mod:  'int',
            so:   'int',
            max:  'int',
            icon: 'text',
            img:  'text',
            in:   'text',
            geo:  'text',
            size: 'text',
            lat:  'text',
            rec:  'text',
        },
    };

    this.$get = function(API, DB, ImgCache, $q) {
        var wait = DB.initializeTable(table);
        return {
            update: function() {
                return API.get('get_fishes').then(function(data) {
                    return wait.then(function() {
                        return data;
                    });
                }).then(function(data) {
                    var image_endpoint = 'https://www.ifiske.se'; // eslint-disable-line camelcase
                    console.log('Downloading all fish images: ', data);
                    for (var fish in data) {
                        ImgCache.cacheFile(image_endpoint + data[fish].img); // eslint-disable-line camelcase
                    }
                    return DB.populateTableNew(table, data)
                    .then(function() {
                        return 'Fish';
                    }, function(err) {
                        console.warn(err);
                        return $q.reject(err);
                    });
                });
            },

            getAll: function() {
                return wait.then(function() {
                    return DB.getMultiple([
                        'SELECT * FROM Fish',
                    ].join(' '));
                });
            },
            getOne: function(id) {
                return wait.then(function() {
                    return DB.getSingle([
                        'SELECT * FROM Fish',
                        'WHERE id = ?',
                    ].join(' '), [id]);
                });
            },
        };
    };
});
