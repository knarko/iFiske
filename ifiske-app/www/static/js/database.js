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
    testUpdater: function(){
        API.getAreas(function(data){
            Database.updateTable('Regions',data.regions);
            Database.updateTable('Areas', data.areas);
            Database.updateTable('Area_keywords', data.area_keywords);
        });
    },

    //Initialies the database
    //TODO: Use external SQL.schema instead
    init: function(){
        var errorCallback = function(err){console.log(err)};
        var successCallback = function(){console.log("success")};
        this.DB.transaction(function(tx){
            tx.executeSql('DROP TABLE IF EXISTS Regions');
            tx.executeSql('CREATE TABLE IF NOT EXISTS Regions (id int, name text, long real, lat real, quantity int, PRIMARY KEY (id))');
            tx.executeSql('DROP TABLE IF EXISTS Areas');
            tx.executeSql('CREATE TABLE IF NOT EXISTS Areas (id int,name text, region_id int, org_id int,long real,lat real, PRIMARY KEY (id), FOREIGN KEY (region_id) REFERENCES Regions(id), FOREIGN KEY (org_id) REFERENCES Organisations(id))');
            tx.executeSql('DROP TABLE IF EXISTS Area_keywords');
            tx.executeSql('CREATE TABLE IF NOT EXISTS Area_keywords (area_id int, keyword text, FOREIGN KEY (area_id) REFERENCES Areas(id))');
            tx.executeSql('DROP TABLE IF EXISTS Products');
            tx.executeSql('CREATE TABLE IF NOT EXISTS Products (id int, smsdisplay int, vat int, saleschannel int, area_id int, name text, price int, rule_id int, sortorder int, headline text, important text, notes text, smscode text, PRIMARY KEY (id), FOREIGN KEY (area_id) REFERENCES Areas(id), FOREIGN KEY (rule_id) REFERENCES Rules(id))');
            tx.executeSql('DROP TABLE IF EXISTS Species_areas');
            tx.executeSql('CREATE TABLE IF NOT EXISTS Species_areas (species_id int, area_id int, cmt text, level int, FOREIGN KEY (species_id) REFERENCES Species(id), FOREIGN KEY (area_id) REFERENCES Areas(id))');
            tx.executeSql('DROP TABLE IF EXISTS Species');
            tx.executeSql('CREATE TABLE IF NOT EXISTS Species (id int, name text, latin text, PRIMARY KEY (id))');
            tx.executeSql('DROP TABLE IF EXISTS Organisations');
            tx.executeSql('CREATE TABLE IF NOT EXISTS Organisations (id int, name text, region region, description text, homepage text, contact text, PRIMARY KEY (id))');
        },
        errorCallback,
        successCallback
                           );
    },

    /**
     * updateTable
     * inserts values into a table
     * table: A string containing the name of the table to update
     * dataset: An array of arrays, each containing all the values to insert to a row
     * callback: function to call when done
     *
     * TODO: Create better link between the parsing and this function, since they are highly dependant on each other.
     * TODO: Actually use the callback
     **/
    updateTable: function(table, dataset, callback){
        var query = '';
        var errorCallback = function(err){console.log(err)};
        var successCallback = function(){console.log("success")};
        switch(table) {
            case 'Areas':
                query = 'INSERT INTO Areas (id, name, region_id, org_id, long, lat) VALUES (?,?,?,?,?,?);';
            break;
            case 'Regions':
                query = 'INSERT INTO Regions (id, name, long, lat, quantity) VALUES (?,?,?,?,?);';
            break;
            case 'Area_keywords':
                query = 'INSERT INTO Area_keywords (area_id, keyword) VALUES (?,?);';
            break;
            default:
                throw Error('Not yet implemented');
        }
        this.DB.transaction(function(tx){
            for(var i in dataset){
                var entry = dataset[i];
                tx.executeSql(query, entry);
            }
        }, errorCallback, successCallback);
        if (callback)
            callback();
    },

    search: function(searchstring, callback) {
        var errorCallback = function(err){console.log(err)};
        var querySuccess = function(tx, results){
            callback(results);
        };
        var successCallback = function(){
            console.log('success');
        };
        this.DB.transaction(function(tx){
            tx.executeSql([
                'SELECT * ',
                'FROM Areas ',
                'WHERE Areas.name LIKE ?',
                'UNION',
                'SELECT DISTINCT Areas.* ',
                'FROM Area_keywords ',
                'INNER JOIN Areas ON Areas.id = Area_keywords.area_id',
                'WHERE Area_keywords.keyword OR Areas.name LIKE ?',
                'UNION',
                'SELECT Areas.* ',
                'FROM Regions ',
                'INNER JOIN Areas ON Areas.region_id = Regions.id ',
                'WHERE Areas.region_id = Regions.id AND Regions.name = ?'].join('\n'),
                ['%' + searchstring + '%', '%' + searchstring + '%', '%' + searchstring + '%'],
                querySuccess);
        },errorCallback, successCallback);

    }
});

