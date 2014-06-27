/**
 * @class my_licenses
 * @extends Page
 * @module Pages
 */
var my_licenses = Object.freeze({
    go: function() {
        Navigate.to('my_licenses', this.onload);
    },
    onload: function(text) {
        Database.getSubscriptions(function (result) {
            var list = $(text).find("#licenses-list");
            list.empty();
            var newlist = [];
            for(var i = 0; i < result.rows.length; ++i) {
                newlist.push(my_licenses.createLicense(result.rows.item(i)));
            }
            list.html(newlist.join(''));
            $('.button').bind('touchend', my_licenses.buttonclick);
        });
    },
    /**
     * Creates a new fishing license
     * @method createLicense
     * @param {Object} props
     * @return {String}
     */
    createLicense: function (props) {
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
            my_licenses.months[from.getMonth()],
            '</span><br/><span class="date">till ',
            to.getDate(),
            ' ',
            my_licenses.months[to.getMonth()],
            '</div>'
        ].join('');
    },
    /**
     * Listener for buttonclick
     * @method buttonclick
     * @param {Event} e
     */
    buttonclick: function (e) {
        license.go(parseInt($(e.target).attr('data-id')));
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
