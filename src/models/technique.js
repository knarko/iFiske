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

    this.$get = function(BaseModel) {
        var model = new BaseModel(table);

        return model;
    };
});
