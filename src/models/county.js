angular.module('ifiske.models')
.provider('County', function() {
    var table = {
        name:      'County',
        apiMethod: 'get_counties',
        primary:   'ID',
        members:   {
            ID: 'int',
            s:  'text',
            t:  'text',
            d:  'text',
        },
    };

    this.$get = function(DB, BaseModel) {
        var model = new BaseModel(table);
        angular.extend(model, {
            getAll: function() {
                return model.wait.then(function() {
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
        });

        return model;
    };
});
