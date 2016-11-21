angular.module('ifiske.models')
.provider('Product', function() {
    var table = {
        name:      'Product',
        primary:   'ID',
        apiMethod: 'get_products',
        members:   {
            ID:    'int',
            t:     'text',
            t2:    'text',
            no:    'text',
            im:    'text',
            pf:    'text',
            ai:    'int',
            ri:    'int',
            ch:    'int',
            price: 'int',
            mod:   'int',
            so:    'int',
            hl:    'text',
        },
    };

    this.$get = function(DB, BaseModel) {
        var model = new BaseModel(table);

        angular.extend(model, {
            getValidity: function(product) {
                console.log(product, product.rev, Boolean(product.rev));
                if (product.rev === 1) {
                    return 'revoked';
                }
                var now = parseInt(Date.now() / 1000);
                if (product.fr < now) {
                    return now < product.to ? 'valid' : 'expired';
                }
                return 'inactive';
            },

            /**
            * Gets information about a product
            * @method getOne
            * @param {Integer} productID
            */
            getOne: function(productID) {
                return model.wait.then(function() {
                    return DB.getSingle([
                        'SELECT DISTINCT Product.*,',
                        'Rule.t as rule_t,',
                        'Rule.ver as rule_ver,',
                        'Rule.d as rule_d',
                        'FROM Product',
                        'JOIN Rule ON Rule.ID = Product.ri',
                        'WHERE ID = ?',
                        'ORDER BY so',
                    ].join(' '),
                    [productID]);
                });
            },

            /**
            * Gets all products from an area
            * @method getByArea
            * @param {Integer} areaID
            */
            getByArea: function(areaID) {
                return model.wait.then(function() {
                    return DB.getMultiple([
                        'SELECT DISTINCT Product.*,',
                        'Rule.t as rule_t,',
                        'Rule.ver as rule_ver,',
                        'Rule.d as rule_d',
                        'FROM Product',
                        'JOIN Rule ON Rule.ID = Product.ri',
                        'WHERE ai = ?',
                        'ORDER BY so',
                    ].join(' '),
                    [areaID]);
                });
            },
        });

        return model;
    };
});
