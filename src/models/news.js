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
    this.$get = function(DB, API, $q, localStorage, ImgCache) {
        var wait = DB.initializeTable(table);

        return {
            update: function(shouldupdate) {
                // Always update
                return API.get_content_menu().then(function(data) {
                    return wait.then(function() {
                        return data;
                    });
                }).then(function(data) {
                    localStorage.set('NEWS', data.title);
                    for (var nItem in data.contents) {
                        ImgCache.cacheFile(data.contents[nItem].icon);
                    }
                    return DB.populateTable(table, data.contents)
                    .then(function() {
                        return 'News';
                    }, function(err) {
                        console.warn(err);
                        return $q.reject(err);
                    });
                });
            },

            getTitle: function() {
                return localStorage.get('NEWS');
            },

            getAll: function() {
                return wait.then(function() {
                    return DB.getMultiple([
                        'SELECT *',
                        'FROM News',
                    ].join(' '));
                });
            },
            getOne: function(id) {
                return wait.then(function() {
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
