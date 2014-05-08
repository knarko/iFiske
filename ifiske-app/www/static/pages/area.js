var area = Object.freeze({
    go: function(id) {
        Navigate.to('area', this.onload, [id]);
    },
    onload: function(text, id) {
        Database.getArea(id, function(area) {
            if(area != null) {
                var photosdiv = $(text).find("#photos");
                API.getPhotos(area.org_id, function(photos) {
                    if(photos) {
                        var photo = document.createElement('img');
                        photo.src = photos[0];
                        photosdiv.append(photo);
                    }
                    /** Only add one image for now
                      $.each(photos, function () {
                      var photo = document.createElement('img');
                      photo.src = this;
                      photosdiv.append(photo);
                      });
                    */
                });
                $(text).find('.area-name').text(area.name);
                $(text).find('.area-description').html(parse(area.description));
            } else {
                throw Error('Tried going to an Area that did not exist');
            };
        });
    }
});

function parse (text) {
    return text.replace(/&#10;/g,'<br/>');
}
