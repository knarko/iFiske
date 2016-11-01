angular.module('ifiske.models')
.provider('Admin', function() {
    this.$get = function($q, API, Organization) {
        var organizations = {};
        var products = [];

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
            getProduct: function(productID) {
                var p = products[productID];
                if (p) {
                    return $q.resolve(p);
                } else {
                    return this.getProducts().then(function() {
                        console.log(productID, products);
                        return products[productID];
                    });
                }
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
                    console.log('orgs is', organizations, orgID, organizations[orgID].pr);
                    return organizations[orgID].products;
                });
            },
        };
        model.wait = model.getOrganizations();

        return model;
    };
});
