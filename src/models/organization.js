angular.module('ifiske.models')
.provider('Organization', function() {
    var table = {
        name:    'Organization',
        primary: 'ID',
        members: {
            ID:   'int',
            t:    'text',
            d:    'text',
            cp:   'text',
            url:  'text',
            co:   'int',
            mod:  'int',
            vat:  'int',
            dp:   'int',
            fva:  'int',
            org:  'int',
            ml:   'int',
            logo: 'text',
        },
    };

    this.$get = function(DB, API) {
        var wait = DB.initializeTable(table);
        return {
            update: function(shouldupdate) {
                if (shouldupdate)
                    return API.get_organizations().then(function(data) {
                        return wait.then(function() {
                            return data;
                        });
                    }).then(DB.insertHelper(table));
            },
            getOne: function(id) {
                return wait.then(function() {
                    return DB.getSingle([
                        'SELECT * FROM Organization',
                        'WHERE ID = ?',
                    ].join(' '), [id]);
                });
            },
        };
    };
});
