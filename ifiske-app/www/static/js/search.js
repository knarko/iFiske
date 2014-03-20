//searchfunction

Search = Object.freeze(
        {
            DB: window.openDatabase("fiskebasen", "1.0", "fiskebasen", 10000000),

            search: function(key)
            {
                var query = "SELECT * FROM Areas WHERE name LIKE ? UNION SELECT * FROM Area_keywords WHERE name LIKE ?";

                this.DB.transaction(function(tx) {
                
                    tx.executeSql(query, key, key);

                });
            }
        });
