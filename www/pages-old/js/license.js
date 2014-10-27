/**
 * @class license
 * @extends Page
 * @module Pages
 */
var license = Object.freeze({
    go: function (id) {
        Navigate.to('license', this.onload, [id]);
    },
    onload: function (text, id) {
        Database.getSubscriptionByid(id, function (result) {
            if (result != null) {
                //TODO: Actually show the license
            } else {
                throw Error('No such subscription ID');
            }
        });
    }
});
