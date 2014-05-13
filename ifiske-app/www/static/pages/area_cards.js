var area_cards = Object.freeze({
    go: function(id) {
	Navigate.to('area_cards', this.onload, [id]);
    },
    onload: function (text, id) {
	Database.getProductsByArea(id, function(result) {

	    if (result != null || result.rows.length == 0) {
		var items = $();
		for (var i = 0; i < result.rows.length; ++i) {
		    var item = document.createElement('div');
		    $(item).text(result.rows.item(i).name);
		    $(item).addClass('button');
		    items.push(item);
		}
		$('#cardlist').append(items);
		$('#cardlist').on('touchend','.button',function(a,b) {
		    console.log(a);
		    console.log($(this));
		});
	    } else {
		//TODO: default message
		Debug.log('No cards found for Area Id ' + id);
	    }
	});
    }
});
