// Database management class
var LONGITUDE	= "long";
var NAME			= "name";
var LATITUDE	= "lat";
var QUANTITY	= "quantity";

// function that gets database object
//
Database = {
	DB: window.getDatabase("ifiske", "0.1", "Waters DB", 1000000),//TODO: Size calculations
	updateWaters: function(data){
		errorCallBack = function(err){console.log(err)};
		successCallBack = function(){console.log("success")};
		// Create regions
		this.DB.transaction(function(tx){
			tx.executeSql('DROP TABLE IF EXISTS REGIONS');
			tx.executeSql('CREATE TABLE IF NOT EXISTS REGIONS (id unique primary key, name, longitude, latitude, quantity)');
		}, errorCallBack, successCallBack);
		//Create areas
		this.DB.transaction(function(tx){
			tx.executeSql('DROP TABLE IF EXISTS AREAS');
			//int id, text name, long longitude, long latitude, text keywords, int regID, int orgID, text description, foreign products, foreign species
			tx.executeSql('CREATE TABLE IF NOT EXISTS AREAS (id unique primary key, name, longitude, latitude, keywords, regID, orgID, description, products, species)');
		}, errorCallBack, successCallBack);
		// Create products
		this.DB.transaction(function(tx){
			tx.executeSql('DROP TABLE IF EXISTS PRODUCTS');
			tx.executeSql('CREATE TABLE IF NOT EXISTS PRODUCTS (id unique primary key, smsDisplay, vat, saleschannel, typetitle, areaID, name, price, ruleID, sortorder, headline, important, notes, smsCode');
		}, errorCallBack, successCallBack);
		// Create species
		this.DB.transaction(function(tx){
			tx.executeSql('DROP TABLE IF EXISTS SPECIES');
			tx.executeSql('CREATE TABLE IF NOT EXISTS SPECIES (id unique primary key, areaID, fid foreign, level, comment');
		}, errorCallBack, successCallBack);


	}
};
