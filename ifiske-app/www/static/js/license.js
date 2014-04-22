//TODO: Go through and look if this can be moved to other object
License = Object.freeze({
    fetch: function(target) {
        target = target || '';
        Database.getProductById("cards", function(result) {
           Navigate.to('my_cards', {searchresults: result});
        });
    }
});
