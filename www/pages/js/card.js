/**
 * @class card
 * @extends Page
 * @module Pages
 */
var card = Object.freeze({
    go: function (id) {
        Navigate.to('card', this.onload, [id]);
    },
    onload: function (text, id) {
        Database.getSubscriptionByid(id, function (result) {
            if (result != null) {
                //TODO: Actually show the card
            } else {
                throw Error('No such subscription ID');
            }
        });
    }
});
