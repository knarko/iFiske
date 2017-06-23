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
    this.$get = function(DB, API, $q, localStorage, ImgCache, BaseModel) {
      var model = new BaseModel(table);

      angular.extend(model, {
        update: function(shouldupdate) {
          // Always update
          return API.get_content_menu().then(function(data) {
            if (shouldupdate === 'skipWait')
              return data;
            return model.wait.then(function() {
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
      });

      return model;
    };
  });
