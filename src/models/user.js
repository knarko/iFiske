angular.module('ifiske.models')
  .provider('User', function() {
    const tables = {
      info: {
        name:    'User_Info',
        primary: 'ID',
        members: {
          ID:       'int',
          username: 'text',
          loggedin: 'text',
          IP1:      'text',
          IP2:      'text',
          name:     'text',
          email:    'text',
          created:  'text',
          mypage:   'text',
          profile:  'text',
        },
      },
      number: {
        name:    'User_Number',
        primary: 'number',
        members: {
          number: 'text',
        },
      },
      favorite: {
        name:    'User_Favorite',
        primary: 'ID',
        members: {
          ID:  'int',
          a:   'int',
          add: 'int',
          not: 'int',
          cnt: 'int',
        },
      },
      product: {
        name:    'User_Product',
        primary: 'ID',
        members: {
          ID:       'int',
          at:       'int',
          code:     'int',
          fr:       'int',
          fullname: 'text',
          ot:       'text',
          ref1:     'int',
          ref2:     'int',
          t:        'text',
          subt:     'text',
          to:       'int',
          pid:      'int',
          pdf:      'text',
          qr:       'text',
          fine:     'text',
          rev:      'int',
        },
      },
    };

    this.$get = function(
      DB,
      $q,
      API,
      Push,
      ToastService,
      sessionData,
      Product,
      analytics,
    ) {
      const p = [];
      for (const table in tables) {
        p.push(DB.initializeTable(tables[table]));
      }
      const wait = $q.all(p).then(function(changed) {
        for (let i = 0; i < changed.length; ++i) {
          if (changed[i])
            return update('skipWait');
        }
      });

      /**
        * Cleans all the user data from database
        * @return {Promise}  Promise when done
        */
      function clean() {
        const p = [];
        for (const table in tables) {
          p.push(DB.initializeTable(tables[table]));
        }
        Raven.setUserContext();
        return $q.all(p)
          .then(function() {
            console.log('Removed user info from database');
          }, function(err) {
            console.log('Could not remove user data from database!', err);
          });
      }
      function update(shouldUpdate) {
        if (!sessionData.token) {
          return;
        }
        let innerWait = wait;
        if (shouldUpdate === 'skipWait')
          innerWait = $q.resolve();
        return innerWait.then(function() {
          const p = [];
          p.push(API.user_get_favorites().then(function(favorites) {
            DB.populateTable(tables.favorite, favorites);
          }));
          p.push(API.user_info().then(function(data) {
            const numbers = data.numbers;
            const numArr = [];
            for (let i = 0; i < numbers.length; ++i) {
              numArr.push({number: numbers[i]});
            }

            Raven.setUserContext(data);

            return $q.all([
              DB.populateTable(tables.info, [data])
                .then(function() {
                  return 'User_Info';
                }, function(err) {
                  console.log(data);
                  console.log(err);
                  return $q.reject(err);
                }),
              DB.populateTable(tables.number, numArr)
                .then(function() {
                  return 'User_Numbers';
                }, function(err) {
                  console.log(err);
                  return $q.reject(err);
                }),
            ]);
          }));
          p.push(API.user_products().then(function(products) {
            DB.populateTable(tables.product, products);
          }));

          return $q.all(p);
        }).catch(function(err) {
          if (err && err.error_code === 7) {
            ToastService.show('You have been logged out');
            logout();
          }
          throw err;
        });
      }

      function login(username, password) {
        const p = API.user_login(username, password)
          .then(update);
        p.then(Push.reset);
        p.then(function() {
          analytics.trackEvent('Login and Signup', 'Login');
        }, function(error) {
          $q.all([
            analytics.trackEvent('Login and Signup', 'Login Failure'),
            analytics.trackException('Login Failure', false),
          ]);
          return error;
        });
        return p;
      }

      function logout() {
        analytics.trackEvent('Login and Signup', 'Logout');
        return $q.all([
          clean(),
          API.user_logout(),
          Push.logout(),
        ]);
      }

      return {
        update: update,
        login:  login,
        logout: logout,

        getInfo: function() {
          return wait.then(function() {
            return DB.getSingle([
              'SELECT *',
              'FROM User_Info',
            ].join(' '));
          });
        },

        getNumbers: function() {
          return wait.then(function() {
            return DB.getMultiple([
              'SELECT *',
              'FROM User_Number',
            ].join(' '));
          });
        },

        getProduct: function(id) {
          function getter(id) {
            return wait.then(function() {
              return DB.getSingle(`
                SELECT User_Product.*, Product.ai,
                Rule.t as rule_t,
                Rule.ver as rule_ver,
                Rule.d as rule_d
                FROM User_Product
                LEFT JOIN Product ON Product.ID = User_Product.pid
                LEFT JOIN Rule ON Rule.ID = Product.ri
                WHERE User_Product.ID = ?
              `, [id]).then(function(product) {
                if (!product) {
                  return Promise.reject(`Couldn't find product with id '${id}`);
                }
                product.validity = Product.getValidity(product);
                return product;
              });
            });
          }

          return getter(id).catch(err => {
            console.warn(err);
            return API.user_products()
              .then(products => {
                return DB.populateTable(tables.product, products);
              })
              .then(() => {
                return getter(id);
              });
          });
        },

        getProducts: function() {
          return wait.then(function() {
            return DB.getMultiple([
              'SELECT User_Product.*,',
              'Rule.t as rule_t,',
              'Rule.ver as rule_ver,',
              'Rule.d as rule_d',
              'FROM User_Product',
              'LEFT JOIN Product ON Product.ID = User_Product.pid',
              'LEFT JOIN Rule ON Rule.ID = Product.ri',
            ].join(' ')).then(function(products) {
              products.forEach(function(product) {
                console.log(product);
                product.validity = Product.getValidity(product);
              });
              return products;
            });
          });
        },

        getFavorites: function() {
          return wait.then(function() {
            return DB.getMultiple([
              'SELECT *',
              'FROM User_Favorite',
              'JOIN Area ON User_Favorite.a = Area.ID',
            ].join(' '));
          });
        },

        removeFavorite: function(id) {
          return wait.then(function() {
            return DB.runSql([
              'DELETE FROM User_Favorite',
              'WHERE a = ?',
            ].join(' '), [id]);
          });
        },

        addFavorite: function(id) {
          return wait.then(function() {
            return DB.runSql([
              'INSERT INTO User_Favorite',
              '(a, "not") VALUES (?, 0)',
            ].join(' '), [id]);
          });
        },

        setFavoriteNotification: function(id, not) {
          return wait.then(function() {
            return DB.runSql([
              'UPDATE User_Favorite',
              'SET "not" = ? WHERE a = ?',
            ].join(' '), [not, id]);
          });
        },
      };
    };
  });
