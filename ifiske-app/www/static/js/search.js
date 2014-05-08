//TODO: Go through and look if this can be moved to other object
Search = Object.freeze({
    go: function(target) {
    	alert("searching");
        target = target || '';
        Database.search(target, function(result) {
           Navigate.to('search', {searchresults: result});
        });
    }
});
