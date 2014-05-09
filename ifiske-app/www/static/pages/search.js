var search = Object.freeze({
    go: function() {
        if($("#search").length == 0)
            Navigate.to('search', this.onload);
        this.onload($("#content"));
    },
    onload: function(text) {
        var searchstring = $("#searchfield").val();
        Database.search(searchstring, function(result) {
            var list = $(text).find("#search-list")
            $(list).empty();
            $.each(
                result,
                function () {
                    list.append(createButton(this));
                }
            );
        });

    }
});
var createButton = function (props) {
    var btn = document.createElement('div');
    btn.classList.add('button');
    $(btn).bind('touchend', function () {
        area.go(props.id);
    });
    $(btn).text(props.name);
    return btn;
};
