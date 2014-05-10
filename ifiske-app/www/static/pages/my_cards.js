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
                newlist.push(my_cards.createCard(result.rows.item(i)));
            }
            list.html(newlist.join(''));
            $('.button').bind('touchend', my_cards.buttonclick);
        });
    },
    createCard: function (props) {
        console.log(props);
        var from = new Date(props.validFrom);
        var to = new Date(props.validTo);
        return [
            '<div class="button" data-id="',
            props.id,
            '"><h1>',
            props.product_title,
            '</h1><span>',
            props.name,
            '</span><span class="date">fran ',
            from.getDate(),
            ' ',
            my_cards.months[from.getMonth()],
            '</span><br/><span class="date">till ',
            to.getDate(),
            ' ',
            my_cards.months[to.getMonth()],
            '</div>'
        ].join('');
    },
    buttonclick: function (e) {
        area.go(parseInt($(e.target).attr('data-id')));
    },
    months: [
        'Januari',
        'Februari',
        'Mars',
        'April',
        'Maj',
        'Juni',
        'Juli',
        'Augusti',
        'September',
        'Oktober',
        'November',
        'December'
    ]
});
