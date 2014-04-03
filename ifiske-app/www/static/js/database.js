/**
 * Database
 * An object that contains the database functions
 *
 * TODO: Look into using callbacks
 * TODO: Maybe move some functions around to other objects?
 **/
Database = Object.freeze({
    //TODO: Size calculation
    DB: window.openDatabase("fiskebasen", "1.0", "fiskebasen", 10000000),

    update: function(callback) {
        callback = callback || function(){};
        API.getUpdates(function(timestamp){
            if (timestamp != localStorage.getItem('db_updated')) {
                localStorage.setItem('db_updated', timestamp);

                Database.clean(function() {
                    Database.init(function() {
                        API.getAreas(function(data) {
                            Database.updateTable('Regions',data.regions);
                            Database.updateTable('Areas',data.areas);
                            Database.updateTable('Area_keywords', data.area_keywords);
                            Database.updateTable('Products', data.products);
                            callback();
                        });
                    });
                });
            }
        });
    },

    tableDefinition: {
        Regions: [
            'id', 'name', 'long', 'lat', 'quantity'
        ],
        Areas: [
            'id', 'name', 'region_id', 'org_id', 'long', 'lat', 'description'
        ],
        Area_keywords: [
            'area_id', 'keyword'
        ],
        Products: [
            'id', 'smsdisplay', 'vat', 'saleschannel', 'area_id', 'name',
            'price', 'rule_id', 'sortorder', 'headline', 'important', 'notes',
            'smscode'
        ]
    },

    clean: function(callback) {
        callback = callback || function(){};
        var errorCallback = function(err){console.log(err)};
        this.DB.transaction(
            function(tx) {
            tx.executeSql('DROP TABLE IF EXISTS Regions');
            tx.executeSql('DROP TABLE IF EXISTS Areas');
            tx.executeSql('DROP TABLE IF EXISTS Area_keywords');
            tx.executeSql('DROP TABLE IF EXISTS Products');
            tx.executeSql('DROP TABLE IF EXISTS Species_areas');
            tx.executeSql('DROP TABLE IF EXISTS Species');
            tx.executeSql('DROP TABLE IF EXISTS Organisations');
        },
        errorCallback,
        callback
        );
    },

    //Initialies the database
    //TODO: Use external SQL.schema instead
    init: function(callback){
        callback = callback || function(){};
        var errorCallback = function(err){console.log(err)};
        Database.DB.transaction(
            function(tx) {
            tx.executeSql([
                'CREATE TABLE IF NOT EXISTS Regions (',
                'id int, name text, long real, lat real, quantity int,',
                'PRIMARY KEY (id))'
            ].join('\n'));

            tx.executeSql([
                'CREATE TABLE IF NOT EXISTS Areas (',
                'id int, name text, region_id int, org_id int,long real,',
                'lat real, description text,',
                'PRIMARY KEY (id),',
                'FOREIGN KEY (region_id) REFERENCES Regions(id),',
                'FOREIGN KEY (org_id) REFERENCES Organisations(id))'
            ].join('\n'));

            tx.executeSql([
                'CREATE TABLE IF NOT EXISTS Area_keywords (',
                'area_id int, keyword text,',
                'FOREIGN KEY (area_id) REFERENCES Areas(id))'
            ].join('\n'));

            tx.executeSql([
                'CREATE TABLE IF NOT EXISTS Products (',
                'id int, smsdisplay int, vat int, saleschannel int,',
                'area_id int, name text, price int, rule_id int,',
                'sortorder int, headline text, important text, notes text,',
                'smscode text,',
                'PRIMARY KEY (id),',
                'FOREIGN KEY (area_id) REFERENCES Areas(id),',
                'FOREIGN KEY (rule_id) REFERENCES Rules(id))'
            ].join('\n'));

            tx.executeSql([
                'CREATE TABLE IF NOT EXISTS Species_areas (',
                'species_id int, area_id int, cmt text, level int,',
                'FOREIGN KEY (species_id) REFERENCES Species(id),',
                'FOREIGN KEY (area_id) REFERENCES Areas(id))'
            ].join('\n'));

            tx.executeSql([
                'CREATE TABLE IF NOT EXISTS Species (',
                'id int, name text, latin text,',
                'PRIMARY KEY (id))'
            ].join('\n'));

            tx.executeSql([
                'CREATE TABLE IF NOT EXISTS Organisations (',
                'id int, name text, region region, description text,',
                'homepage text, contact text,',
                'PRIMARY KEY (id))'
            ].join('\n'));
        },
        errorCallback,
        callback
        );
    },

    /**
     * updateTable
     * inserts values into a table
     * table: A string containing the name of the table to update, corresponding to a name in tableDefinition
     * dataset: An array of arrays, each containing all the values to insert
     * to a row
     * callback: callback function
     *
     * TODO: Create better link between the parsing and this function,
     * they are highly dependant on each other.
     * TODO: Actually use the callback
     **/
    updateTable: function(table, dataset, callback){
        callback = callback || function(){};
        var query = 'INSERT INTO ';
        var errorCallback = function(err){console.log(err)};
        var successCallback = function(){callback();};
        if (this.tableDefinition[table]) {
            query += table + ' (' + this.tableDefinition[table] + ') VALUES (?'
            + Array(this.tableDefinition[table].length).join(',?') + ');';
        } else {
            throw Error('Not yet implemented');
        }
        this.DB.transaction(function(tx){
            for(var i in dataset){
                tx.executeSql(query, dataset[i]);
            }
        }, errorCallback, successCallback);
    },

    search: function(searchstring, callback) {
        callback = callback || function(){};
        var errorCallback = function(err){console.log(err)};
        var querySuccess = function(tx, results){
            var resultsArray = []
            for(var i = 0; i < results.rows.length; ++i){
                resultsArray.push(results.rows.item(i));
            }
            callback(resultsArray);
        };
        var successCallback = function(){
            console.log('success');
        };
        this.DB.transaction(function(tx){
            tx.executeSql([
                'SELECT * ',
                'FROM Areas ',
                'WHERE name LIKE ?',
                'UNION',
                'SELECT DISTINCT Areas.*',
                'FROM Area_keywords',
                'INNER JOIN Areas ON Areas.id = Area_keywords.area_id',
                'WHERE Area_keywords.keyword OR Areas.name LIKE ?'].join('\n'),
                ['%' + searchstring + '%', '%' + searchstring + '%'],
                querySuccess);
        },errorCallback, successCallback);
    }

});

