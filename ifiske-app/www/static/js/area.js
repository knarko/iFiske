var Area = Object.freeze({
    go: function(id) {
        Database.getArea(id, function(result) {
            if(result != null) {
            Navigate.to('area', {area: result});
            } else {
                throw Error('Tried going to an Area that did not exist');
            };
        });
    }
});
