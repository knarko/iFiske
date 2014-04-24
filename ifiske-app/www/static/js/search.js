//TODO: Go through and look if this can be moved to other object
var Search = Object.freeze({
    go: function(target) {
        target = target || '';
        Database.search(target, function(result) {
           Navigate.to('search', {searchresults: result});
        });
    }
});
