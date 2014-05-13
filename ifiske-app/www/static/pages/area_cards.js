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

		/* Add an event listener to cardlist listening to touchend
		   events fired by children matching the selector */
		cardlist.on('touchend','.card',function(a) {
		    console.log(a);
		    console.log($(this));
		});
		cardlist.html(items.join(''));
	    
	    } else {
		//TODO: default message
		Debug.log('No cards found for Area Id ' + id);
	    }
	});
    },

    /* Create a div representing a fishing license */
    createLicense: function(row) {
	var license = ['<div class="license" data-id="',
		       row.id,
		       '">',
		       '<h1>',
		       row.name,
		       '</h1>',
		       '<div class="button">Web-Köp</div>',
		       '<div class="button">SMS-Köp</div>',
		       '</div>'];
	switch(row.saleschannel) {
	case 0: // Sold in all channels
	    break;
	case 1: // Sold only through SMS
	    delete license[license.length-3];
	    break;
	case 2: // Sold only through Web
	    delete license[license.length-2];
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
