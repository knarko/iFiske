var Search = Object.freeze({
    go: function(target) {

        Navigate.to('search', this.onload);
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
var createButton = function (props) {
    var btn = document.createChildElement('div');
    btn.classlist.add('button');
    btn.ontouchend = "Area.go('" + props.id + "');";
    return btn;
};
