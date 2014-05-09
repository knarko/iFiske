var card = Object.freeze({
    go: function () {
        Navigate.to('card', this.onload);
    },
    onload: function (text) {
        Database.getSubscriptionByid(id, function (result) {
            if (result != null) {
                Navigate.to('card', {card: result});

            } else {
                throw Error('No such subscription ID');
            }
        });
    }
});
