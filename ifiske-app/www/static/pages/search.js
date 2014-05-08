var Search = Object.freeze({
    go: function(target) {
        Navigate.to('search', this);
    },
    onload: function() {
        target = target || '';
        Database.search(target, function(result) {
            $.each(
                result,
                function () {
                    $("#search-list").appendChild(createButton(this));
                }
            );
        });

    }
});
