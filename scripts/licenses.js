gulp.task('foss', function (done) {
  var map = require('map-stream');
  var markdown = require('gulp-markdown');
  gulp.src(['./{plugins,node_modules/@ionic}/*/{license,LICENSE}*'])
    .pipe(markdown())
    .pipe(map(function (file, cb) {
      var fileContent = file.contents.toString();
      var title = file.relative
        .match(/[\\/](.*?)[\\/][^\\/]+$/)[1]
        .replace(/[\\/]/g, '-')
        .replace('@', '');
      file.contents = new Buffer(JSON.stringify({
        title: title,
        text: fileContent,
      }));
      cb(null, file);
    }))
    .pipe(concat('licenses.json', { newLine: ',\r\n' }))
    .pipe(map(function (file, cb) {
      file.contents = new Buffer('[' + file.contents.toString() + ']');
      cb(null, file);
    }))
    .pipe(sortJSON({
      space: 1,
      cmp: function (a, b) {
        return a.key === 'title' ? -1 : 1;
      },
      replacer: function (key, value) {
        if (value.sort) {
          value.sort(function (a, b) {
            return a.title.toLowerCase() > b.title.toLowerCase() ? 1 : b.title.toLowerCase() > a.title.toLowerCase() ? -1 : 0;
          });
        }
        return value;
      },
    }))
    .pipe(gulp.dest('www/static'))
    .on('end', done);
});
