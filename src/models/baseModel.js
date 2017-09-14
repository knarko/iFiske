angular.module('ifiske.models')
  .service('BaseModel', function(DB, API) {
    function BaseModel(table) {
      const model = {
        update: update,
        table:  table,
        getAll: function() {
          return model.wait.then(function() {
            return DB.getMultiple([
              'SELECT *',
              'FROM',
              table.name,
            ].join(' '));
          });
        },
        getOne: function(id) {
          return model.wait.then(function() {
            return DB.getSingle([
              'SELECT *',
              'FROM',
              table.name,
              'WHERE',
              '"' + table.primary + '"',
              '= ?',
            ].join(' '), [id]);
          });
        },
      };
      /**
         * Update function.
         * @param  {boolean|string} shouldupdate - `true` if enough time has passed in order to
         *                                       update, `'skipWait'` if the function should skip
         *                                       waiting for the `wait` Promise to resolve
         * @return {Promise}    A promise for when the update is finished
         */
      function update(shouldupdate) {
        if (!model.table.apiMethod)
          throw new Error(model.table.name + ' does not have an apiMethod!');
        if (shouldupdate)
          return API[model.table.apiMethod]().then(function(data) {
            if (shouldupdate === 'skipWait')
              return DB.populateTable(model.table, data);
            return model.wait.then(function() {
              return DB.populateTable(table, data);
            });
          });
      }

      model.wait = DB.initializeTable(table).then(function(changed) {
        if (changed)
          return model.update('skipWait');
      });
      return model;
    }
    return BaseModel;
  });
