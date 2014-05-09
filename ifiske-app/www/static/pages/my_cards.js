var my_cards = Object.freeze({
    go: function() {
        Navigate.to('my_cards', this.onload);
    },
    onload: function(text) {
        Database.getSubscriptions(function (result) {
            var list = $(text).find("#cards-list");
            list.empty();
            var newlist = [];
            for(var i = 0; i < result.rows.length; ++i) {
                newlist.push(createCard(result.rows.item(i)));
            }
            list.html(newlist.join(''));
            $('.button').bind('touchend', buttonclick);
        });
    },
    createCard: function (props) {
        return [
            '<div class="button" data-id="',
            props.id,
            '"><p>',
            props.name,
            '</p></div>'
        ].join('');
    },
    buttonclick: function (e) {
        area.go(parseInt($(e.target).attr('data-id')));
    }
});
