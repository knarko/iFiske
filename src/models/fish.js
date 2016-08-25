angular.module('ifiske.models')
.provider('Fish', function FishProvider() {
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

    this.$get = function(API, DB, ImgCache) {
        var wait = DB.initializeTable(table);

        return {
            update: function() {
                return API.get('get_fishes')
                .then(function(data) {
                    var ifiskeHome = 'https://www.ifiske.se';
                    console.log('Downloading all fish images: ', data);
                    for (var fish in data) {
                        if (data.hasOwnProperty(fish))
                            ImgCache.cacheFile(ifiskeHome + data[fish].img);
                    }
                    return wait.then(function() {
                        return DB.populateTable(table, data);
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
