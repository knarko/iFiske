angular.module('ifiske.models')
.factory('Admin', [
    'API',
    '$q',
    function(API, $q) {
        var products = {};
        return {
            getProduct: function(productID) {
                var p = products[productID];
                if (p) {
                    return $q.resolve(p);
                } else {
                    return this.getProducts().then(function() {
                        console.log(productID, products)
                        return products[productID];
                    });
                }
            },
            getProducts: function(orgID) {
                return API.adm_products(orgID || 1).then(function(res) {
                    angular.extend(products, res);
                    console.log(products);
                    return res;
                });
            }
        };
    }
]);
