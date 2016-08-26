angular.module('ifiske.models')
.provider('Fish', function FishProvider() {
    var table = {
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

    this.$get = function(API, DB, ImgCache, BaseModel) {
        var model = new BaseModel(table);

        angular.extend(model, {
            update: function(shouldupdate) {
                if (shouldupdate)
                    return API.get_fishes()
                .then(function(data) {
                    var ifiskeHome = 'https://www.ifiske.se';
                    console.log('Downloading all fish images: ', data);
                    for (var fish in data) {
                        if (data.hasOwnProperty(fish))
                            ImgCache.cacheFile(ifiskeHome + data[fish].img);
                    }
                    if (shouldupdate === 'skipWait')
                        return DB.populateTable(table, data);
                    return model.wait.then(function() {
                        return DB.populateTable(table, data);
                    });
                });
            },
        });

        return model;
    };
});
