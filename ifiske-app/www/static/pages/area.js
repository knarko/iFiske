var Area = Object.freeze({
    go: function(id) {
        Navigate.to('area', this.onLoad);
    },
    onload: function(text) {
        Database.getArea(id, function(area) {
            if(area != null) {
                API.getPhotos(area.org_id, function(photos) {
                    area.photos = photos;
                });
            } else {
                throw Error('Tried going to an Area that did not exist');
            };
        });
    }
});
