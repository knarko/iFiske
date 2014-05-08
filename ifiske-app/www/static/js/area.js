var Area = Object.freeze({
    go: function(id) {
        Database.getArea(id, function(result) {
            if(result != null) {
                API.getPhotos(result.org_id, function(photos) {
                    result.photos = photos;
                });
                console.log(result);
            Navigate.to('area', {area: result});
            } else {
                throw Error('Tried going to an Area that did not exist');
            };
        });
    }
});
