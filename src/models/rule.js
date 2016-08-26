angular.module('ifiske.models')
.provider('Rule', function() {
    var table = {
        name:    'Rule',
        primary: 'ID',
        members: {
            ID:  'int',
            ver: 'int',
            d:   'text',
            t:   'text',
        },
    };
    this.$get = function(DB, API) {
        var wait = DB.initializeTable(table);

        return {
            update: function(shouldupdate) {
                if (shouldupdate)
                    return API.get_rules().then(function(data) {
                        return wait.then(function() {
                            return data;
                        });
                    }).then(DB.insertHelper(table));
            },
        };
    };
});
