/**
 * @class area
 * @extends Page
 * @module Pages
 */
var area = Object.freeze({
    go: function(id) {
        Navigate.to('area', this.onload, [id]);
    },
    onload: function(text, id) {
        Database.getArea(id, function(result) {
            if(result != null) {
                var photosdiv = $(text).find("#photos");
                API.getPhotos(result.org_id, function(photos) {
                    if(photos) {
                        var photo = document.createElement('img');
                        photo.src = photos[0];
                        photosdiv.append(photo);
                    }
                    /* Only add one image for now
                      $.each(photos, function () {
                      var photo = document.createElement('img');
                      photo.src = this;
                      photosdiv.append(photo);
                      });
                      */
                });

                $(text).find('.area-name').text(result.name);
                $(text).find('.area-description').html(
                    area.parse(
                        result.description.replace(
                            /(&#10;(&nbsp;)*){3,}/g,"&#10;&#10;"
                )
                )
                );
                $(text).find('#license-button').attr("data-id",result.id);

            } else {
                throw Error('Tried going to an Area that did not exist');
            };
        });
    },
    /**
     * Parses text and creates newlines
     * @method parse
     * @param {String} text
     * @returns {String} Parsed text
     */
    parse: function (text) {
        return text.replace(/&#10;/g,'<br/>');
    }
});

