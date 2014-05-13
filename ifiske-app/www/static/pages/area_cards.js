var area_cards = Object.freeze({
    go: function(id) {
	Navigate.to('area_cards', this.onload, [id]);
    },
    onload: function (text, id) {
	Database.getProductsByArea(id, function(result) {

	    if (result != null || result.rows.length == 0) {
		var items = [];

		for (var i = 0; i < result.rows.length; ++i) {
		    items[items.length] = area_cards.createLicense(
			result.rows.item(i)
		    );
		}
		
		var cardlist = $('#cardlist');

		/* Event listeners on cardlist listening to touchend
		   events fired by license buttons */
		cardlist.on('touchend', '.rules', function() {
		    // Navigate to rules for the given rule id
		    console.log($(this));
		});

		cardlist.on('touchend', '.sms', function() {
		    // TODO: Purchase through SMS
		    console.log($(this));
		});

		cardlist.on('touchend', '.web', function() {
		    // TODO: Purchase through Web
		    console.log($(this));
		});
		
		cardlist.html(items.join(''));
	    
	    } else {
		cardlist.text('Inga fiskekort kunde hittas');
		Debug.log('No cards found for Area Id ' + id);
	    }
	});
    },
    /* Create a div representing a fishing license */
    createLicense: function(row) {
	var license = ['<div class="license"', 
		       'data-id="', row.id, '" ',
		       'data-sms-code="', row.smscode, '" ',
		       'data-rule-id="', row.ruleid, 
		       '">',

		       '<h1>',
		       '<span class="price">',
		       row.price, ':-',
		       '</span>',
		       row.name,
		       '</h1>',
		       
		       '<h2>',
		       row.headline,
		       '</h2>',

		       '<p>',
		       row.typetitle,
		       '</p>',

		       '<p>',
		       row.notes,
		       '</p>',
		       
		       '<p class="important">',
		       row.important,
		       '</p>',

		       '<div class="button web">Web-Köp</div>',
		       '<div class="button sms">SMS-Köp</div>',
		       '<div class="button rules">Regler</div>',
		       '</div>'];

	switch(row.saleschannel) {
	case 0: // Sold in all channels
	    break;
	case 1: // Sold only through SMS
	    delete license[license.length-4];
	    break;
	case 2: // Sold only through Web
	    delete license[license.length-3];
	    break;
	case 4: // Refer to other sellers
	    //TODO;
	    break; 
	default:
	    return undefined;
	}

	
	return license.join('');
	
    }
});
