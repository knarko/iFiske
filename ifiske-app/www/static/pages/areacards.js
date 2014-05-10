var areacards = Object.freeze({
    go: function() {
	Navigate.to('areacards', this.onload);
    },
    onload: function (text) {
	console.log(text);
    }
});
