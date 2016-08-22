angular.module('ifiske.models')
.provider('News', function NewsProvider() {
    var table = {
        name:    'News',
        primary: 'ID',
        members: {
            ID:   'int',
            t:    'text',
            text: 'text',
            img:  'text',
            icon: 'text',
        },
    };
    this.$get = function(DB, API, $q, localStorage) {
        var wait = DB.initializeTable(table);

        return {
            update: function() {
                API.get_content_menu().then(function(data) {
                    return wait.then(function() {
                        return data;
                    });
                }).then(function(data) {
                    localStorage.set('NEWS', data.title);
                    return DB.populateTableNew(table, data.contents)
                    .then(function() {
                        return 'News';
                    }, function(err) {
                        console.warn(err);
                        return $q.reject(err);
                    });
                });
            },

            getAll: function() {
                wait.then(function() {
                    return DB.getMultiple([
                        'SELECT *',
                        'FROM News',
                    ].join(' '));
                });
            },
            getOne: function(id) {
                wait.then(function() {
                    return DB.getSingle([
                        'SELECT *',
                        'FROM News',
                        'WHERE ID = ?',
                    ].join(' '), [id]);
                });
            },
        };
    };
});
