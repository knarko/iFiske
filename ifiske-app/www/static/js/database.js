Database = Object.freeze(
    {
    //TODO: Size calculation
    DB: window.openDatabase("fiskebasen", "1.0", "fiskebasen", 10000000),

    getData: function() {
        API.request({
            action: "get_areas"
        },
        function(e){
            if (e != null) {
                var regions = [];
                $.each(
                    $(e).find('user_areas')[0].children,
                    function(){
                        kitten = $(this);
                        var region = {
                            id: parseInt($(this).attr('id')),
                            name: $(this).attr('name'),
                            long: parseFloat($(this).attr('long')),
                            lat: parseFloat($(this).attr('lat')),
                            quantity: parseInt($(this).attr('quantity'))
                        }
                        regions.push(region);
                    });
                    console.log(regions);
                    Database.updateRegions(regions);
            }
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

    //Updates a table in the database
    updateTable: function(table, data){
        var errorCallback = function(err){console.log(err)};
        var successCallback = function(){console.log("success")};
        this.DB.transaction(function(tx){

        }, errorCallback, successCallback);
    },
    updateRegions: function(regions){
        //Adds entries to Regions
        //var regions = API.getRegions();
        //regions = [{id:1, name:"Fiskeskålen FVO", long:1.2, lat:1.3, quantity:1},{id:2, name:"Fisasdeskålen FVO", long:1.2222, lat:112.3, quantity:51}]
        var errorCallback = function(err){console.log(err)};
        var successCallback = function(){console.log("success")};
        for(var i in regions){
            var r = regions[i];
            console.log(r);
            this.DB.transaction(function(tx){
                tx.executeSql('INSERT INTO Regions (id,name,long,lat,quantity) VALUES (?,?,?,?,?);', [r.id, r.name, r.long, r.lat, r.quantity]);
            }, errorCallback, successCallback);
        }
    }
});

