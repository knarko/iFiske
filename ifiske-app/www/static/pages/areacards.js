var areacards = Object.freeze({
    go: function(id) {
	Navigate.to('areacards', this.onload, [id]);
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
		$("#cardlist").append(items);
	    } else {
		Debug.log("No cards found for Area Id " + id);
	    }
	    
	});
    }
});
