var Search = Object.freeze({
    go: function() {
        Navigate.to('search', this.onload);
    },
    onload: function(text) {
        var searchstring = $("#searchfield").val();
        Database.search(searchstring, function(result) {
            $.each(
                result,
                function () {
                    $(text).find(".list-content").append(createButton(this));
                }
            );
        });

    }
});
var createButton = function (props) {
    var btn = document.createElement('div');
    btn.classList.add('button');
    $(btn).bind('touchend', function () {
        Area.go(props.id);
    });
    $(btn).text(props.name);
    return btn;
};
