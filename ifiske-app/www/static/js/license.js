//TODO: Go through and look if this can be moved to other object
License = Object.freeze({
    fetch: function(target) {
        target = target || '';
        Database.getSubscriptions(function(result)
          {
            console.log(result);
            Navigate.to('my_cards', {cards: result})
          });
        /*Database.getProductById("cards", function(result) {
           Navigate.to('my_cards', {searchresults: result});
        });*/
    }
});
