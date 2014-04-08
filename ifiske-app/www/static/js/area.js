var Area = Object.freeze({
    go: function(id) {
        Database.getArea(id, function(result) {
            Navigate.to('area', {area: result});
        });
    }
});
