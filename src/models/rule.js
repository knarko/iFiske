angular.module('ifiske.models')
  .provider('Rule', function() {
    var table = {
      name:      'Rule',
      apiMethod: 'get_rules',
      primary:   'ID',
      members:   {
        ID:  'int',
        ver: 'int',
        d:   'text',
        t:   'text',
      },
    };
    this.$get = function(BaseModel) {
      var model = new BaseModel(table);

      return model;
    };
  });
