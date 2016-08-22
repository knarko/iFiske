angular.module('ifiske.models')
.provider('County', function() {
    var table = {
        name:    'County',
        primary: 'ID',
        members: {
            ID: 'int',
            s:  'text',
            t:  'text',
            d:  'text',
        },
    };

    this.$get = function(DB, API) {
        var wait = DB.initializeTable(table);

        return {
            update: function() {
                return API.get_counties().then(DB.insertHelper(table));
            },

            getAll: function() {
                return wait.then(function() {
                    return DB.getMultiple([
                        'SELECT DISTINCT County.*',
                        'FROM County',
                        'WHERE County.ID IN (SELECT Area.c1 FROM Area)',
                        'OR County.ID IN (SELECT Area.c2 FROM Area)',
                        'OR County.ID IN (SELECT Area.c3 FROM Area)',
                        'ORDER BY County.t',
                    ].join(' '));
                });
            },
        };
    };
});
