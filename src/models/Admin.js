angular.module('ifiske.models')
.provider('Admin', function() {
    this.$get = function($q, API, Organization, Product) {
        var organizations = {};

        var model = {
            isAdmin: function() {
                return API.user_organizations().then(function(orgs) {
                    console.log(orgs);
                    for (var i in orgs) {
                        return orgs[i].orgid;
                    }
                    return false;
                });
            },
            checkProduct: function(code) {
                return API.adm_check_prod(code);
            },
            revokeProduct: function(product) {
                return API.adm_revoke_prod(product.code);
            },
            getProduct: function(orgID, productID) {
                var product;
                try {
                    product = organizations[orgID].products.filter(function(p) {
                        return Number(p.ID) === Number(productID);
                    })[0];
                } catch (e) {
                }
                if (product) {
                    return $q.resolve(product);
                }

                return model.wait.then(function() {
                    var product;
                    try {
                        product = organizations[orgID].products.filter(function(p) {
                            return Number(p.ID) === Number(productID);
                        })[0];
                    } catch (e) {
                    }
                    if (product) {
                        return product;
                    }
                    return $q.reject('Could not find a product');
                });
            },
            getOrganization: function(orgID) {
                return model.wait.then(function() {
                    return organizations[orgID];
                });
            },
            getOrganizations: function() {
                return API.user_organizations().then(function(orgs) {
                    var p = [];
                    for (var i in orgs) {
                        console.log(i, organizations, orgs);
                        organizations[i] = orgs[i];
                        Organization.getOne(i).then(function(org) {
                            organizations[i].info = org;
                        });
                        p.push(API.adm_products(orgs[i].orgid).then(function(products) {
                            var prods = [];
                            for (var j in products) {
                                products[j].validity = Product.getValidity(products[j]);
                                prods.push(products[j]);
                            }
                            organizations[i].products = prods;
                        }));
                    }
                    return $q.all(p).then(function() {
                        return orgs;
                    });
                });
            },
            getProducts: function(orgID) {
                return model.wait.then(function() {
                    console.log('orgs is', organizations, orgID, organizations[orgID]);
                    return organizations[orgID].products;
                });
            },
        };
        model.wait = model.getOrganizations();

        return model;
    };
});
