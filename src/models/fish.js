/* global Fuse */
angular.module('ifiske.models')
  .provider('Fish', function FishProvider() {
    const table = {
      name:    'Fish',
      primary: 'ID',
      members: {
        ID:   'int',
        t:    'text',
        d:    'text',
        mod:  'int',
        so:   'int',
        max:  'int',
        icon: 'text',
        img:  'text',
        in:   'text',
        geo:  'text',
        size: 'text',
        lat:  'text',
        rec:  'text',
      },
    };

    this.$get = function(API, DB, ImgCache, BaseModel, serverLocation) {
      const model = new BaseModel(table);

      angular.extend(model, {
        update: function(shouldupdate) {
          if (shouldupdate)
            return API.get_fishes()
              .then(function(data) {
                console.log('Downloading all fish images');
                for (const fish in data) {
                  if (data.hasOwnProperty(fish))
                    ImgCache.cacheFile(serverLocation + data[fish].img);
                }
                if (shouldupdate === 'skipWait')
                  return DB.populateTable(table, data);
                return model.wait.then(function() {
                  return DB.populateTable(table, data);
                });
              });
        },
        search: function(searchString) {
          let t0;
          if (performance && performance.now) {
            t0 = performance.now();
          }
          return model.getAll().then(data => {
            const options = {
              keys: [{
                name:   't',
                weight: 0.6,
              }],
              includeScore:     true,
              shouldSort:       true,
              threshold:        0.01,
              distance:         10,
              maxPatternLength: 16,
            };
            return new Fuse(data, options);
          }).then(fuse => {
            if (performance && performance.now) {
              const t1 = performance.now();
              console.log('Searching took:', (t1 - t0), 'ms');
            }
            return fuse.search(searchString);
          });
        },
      });

      return model;
    };
  });
