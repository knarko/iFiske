angular.module('ifiske.models')
  .provider('Technique', function TechniqueProvider() {
    const table = {
      name:      'Technique',
      apiMethod: 'get_techniques',
      primary:   'ID',
      members:   {
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
      const model = new BaseModel(table);

      return model;
    };
  });
