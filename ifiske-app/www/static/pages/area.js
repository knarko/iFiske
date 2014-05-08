var Area = Object.freeze({
    go: function(id) {
        Navigate.to('area', this.onload, [id]);
    },
    onload: function(text, id) {
        Database.getArea(id, function(area) {
            if(area != null) {
                API.getPhotos(area.org_id, function(photos) {
                    //TODO: Add pics
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
    var retval = text.replace(/&#10;/g,'<br/>');
    console.log(retval);
    a = retval;
    return retval;
}
