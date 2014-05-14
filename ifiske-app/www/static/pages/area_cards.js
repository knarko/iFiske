var area_cards = Object.freeze({
    go: function(id) {
	Navigate.to('area_cards', this.onload, [id]);
    },
    onload: function (text, id) {
	Database.getArea(id, function(area) {
	    $('#area_cards_header').text(area.name);
	});
	$('#area_cards_header').text();
	Database.getProductsByArea(id, function(result) {
	    var cardlist = $('#cardlist');

	    if (result != null || result.rows.length == 0) {
		var items = [];

		for (var i = 0; i < result.rows.length; ++i) {
		    items[items.length] = area_cards.createLicense(
			result.rows.item(i)
		    );
		}
		
		/* Event listeners on cardlist listening to touchend
		   events fired by license buttons */
		cardlist.on('touchend', '.rules', function() {
		    // TODO: Navigate to rules for the given rule id
		    Debug.log('Rules');
		});

		/* TODO: SMS plugin
		  cardlist.on('touchend', '.sms', function() {
		    
		    Debug.log('SMS purchase');
		});
		*/

		cardlist.on('touchend', '.web', function() {
		    navigator.app.loadUrl(
			'http://ifiske.se/mobile/index.php?p=5&i=' + 
			    $(this).parent().attr('data-id'), 
			{openExternal: true}
		    );
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

		       '<p class="typetitle">',
		       row.typetitle,
		       '</p>',

		       '<p class="notes">',
		       row.notes,
		       '</p>',
		       
		       '<p class="important">',
		       row.important,
		       '</p>',

		       '<div class="button web">Web-Köp</div>',
		       // TODO: replace with sms plugin
		       '<a href="sms:72456?body=', row.smscode, '">',
		       '<div class="button sms">SMS-Köp</div></a>',
		       '<div class="button rules">Regler</div>',
		       '</div>'];

	switch(row.saleschannel) {
	case 0: // Sold in all channels
	    break;
	case 1: // Sold only through SMS
	    delete license[license.length-7];
	    break;
	case 2: // Sold only through Web
	    delete license[license.length-3];
	    // TODO: replace once sms plugin is used
	    delete license[license.length-4];
	    delete license[license.length-5];
	    delete license[license.length-6];
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
