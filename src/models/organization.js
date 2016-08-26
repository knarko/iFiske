angular.module('ifiske.models')
.provider('Organization', function() {
    var table = {
        name:      'Organization',
        apiMethod: 'get_organizations',
        primary:   'ID',
        members:   {
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

    this.$get = function(BaseModel) {
        var model = new BaseModel(table);

        return model;
    };
});
