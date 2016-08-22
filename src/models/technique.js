angular.module('ifiske.models')
.provider('Technique', function TechniqueProvider() {
    var table = {
        name:    'Technique',
        primary: 'ID',
        members: {
            ID:      'int',
            t:       'text',
            d:       'text',
            so:      'int',
            de:      'text',
            da:      'text',
            icon:    'text',
            img1:    'text',
            img2:    'text',
            img3:    'text',
            youtube: 'text',
        },
    };

    this.$get = function(DB, API) {
        var wait = DB.initializeTable(table);

        return {
            update: function() {
                return API.get_techniques().then(function(data) {
                    return wait.then(function() {
                        return data;
                    });
                }).then(DB.insertHelper(table));
            },
            getAll: function() {
                return wait.then(function() {
                    return DB.getMultiple([
                        'SELECT * FROM Technique',
                    ].join(' '));
                });
            },
            getOne: function(id) {
                return wait.then(function() {
                    return DB.getSingle([
                        'SELECT * FROM Technique',
                        'WHERE ID = ?',
                    ].join(' '), [id]);
                });
            },
        };
    };
});
