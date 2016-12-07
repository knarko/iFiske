/* jshint node: true */
var gulp = require('gulp');
var gutil = require('gulp-util');
var concat = require('gulp-concat');
var sourcemaps = require('gulp-sourcemaps');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var ngAnnotate = require('gulp-ng-annotate');
var gulpif = require('gulp-if');
var minimist = require('minimist');
var plumber = require('gulp-plumber');
var sortJSON = require('gulp-json-sort').default;

var knownOptions = {
    string:  'env',
    default: {
        env: process.env.NODE_ENV || 'production',
    },
};

var options = minimist(process.argv.slice(2), knownOptions);

var paths = {
    static: ['./src/static/**.*'],
    sass:   ['./src/scss/**/*.scss'],
    fonts:  [
        'lib/ionic/release/fonts/*.{woff,otf,ttf}',
        'lib/font-awesome/fonts/*.{woff,otf,ttf}',
    ],
    images: [
        './lib/Leaflet.awesome-markers/dist/images/*',
        './lib/leaflet/dist/images/*',
    ],
    scripts: [
        './src/io-config.js',
        './src/app.js',
        './src/states.js',
        './src/components/**/*.js',
        './src/services/**/*.js',
        './src/directives/**/*.js',
        './src/models/**/*.js',
        './src/translations/*.js',
    ],
    libs: [
        './src/lib/polyfill.js',

        './lib/ionic/release/js/ionic.bundle.js',
        './node_modules/@ionic/cloud/dist/bundle/ionic.cloud.js',
        './lib/ionic-ion-header-shrink/ionic.headerShrink.js',

        './lib/ngCordova/dist/ng-cordova.js',

        './lib/angular-i18n/angular-locale_sv.js',
        // TODO: Allow for other locales maybe?
        './lib/angular-messages/angular-messages.js',
        './lib/angular-simple-logger/dist/angular-simple-logger.js',

        './lib/imgcache.js/js/imgcache.js',
        './lib/angular-imgcache.js/angular-imgcache.js',

        './lib/angular-translate/angular-translate.js',
        './lib/angular-translate-handler-log/angular-translate-handler-log.js',

        './lib/leaflet/dist/leaflet-src.js',
        './lib/ui-leaflet/dist/ui-leaflet.js',
        './lib/leaflet.markercluster/dist/leaflet.markercluster-src.js',
        './lib/leaflet.locatecontrol/dist/L.Control.Locate.min.js',
        './lib/Leaflet.awesome-markers/dist/leaflet.awesome-markers.js',

        './node_modules/moment/moment.js',
        './node_modules/chart.js/dist/Chart.js',
        './node_modules/angular-chart.js/dist/angular-chart.js',
    ],
    templates:  ['src/components/**/*.html'],
    directives: ['src/directives/**/*.html'],
};

gulp.task('serve:before', ['default']);
gulp.task('serve:after', ['watch']);
gulp.task('default', [
    'index',
    'static_images',
    'sass',
    'scripts',
    'libs',
    'fonts',
    'templates',
    'directives',
    'static',
    'images',
]);

gulp.task('index', function(done) {
    gulp.src('src/index.html')
    .pipe(gulp.dest('./www/'))
    .on('end', done);
});

gulp.task('static_images', function(done) {
    gulp.src('src/img/*')
    .pipe(gulp.dest('./www/img'))
    .on('end', done);
});

gulp.task('scripts', function(done) {
    gulp.src(paths.scripts)
    .pipe(plumber({errorHandler: done}))
    .pipe(ngAnnotate())
    .pipe(gulpif(options.env === 'development', sourcemaps.init()))
    .pipe(concat('all.min.js', {newLine: ';\r\n'}))
    .pipe(gulpif(options.env === 'production', uglify()))
    .pipe(gulpif(options.env === 'development', sourcemaps.write()))
    .pipe(gulp.dest('./www/'))
    .on('end', done);
});

gulp.task('fonts', function(done) {
    gulp.src(paths.fonts)
    .pipe(gulp.dest('./www/css/fonts'))
    .on('end', done);
});

gulp.task('directives', function(done) {
    gulp.src(paths.directives)
    .pipe(gulp.dest('./www/directives'))
    .on('end', done);
});
gulp.task('templates', function(done) {
    gulp.src(paths.templates)
    .pipe(gulp.dest('./www/components'))
    .on('end', done);
});

gulp.task('static', ['foss'], function(done) {
    gulp.src(paths.static)
    .pipe(gulp.dest('./www/static'))
    .on('end', done);
});

gulp.task('libs', function(done) {
    gulp.src(paths.libs)
    .pipe(plumber({errorHandler: done}))
    .pipe(gulpif(options.env === 'development', sourcemaps.init()))
    .pipe(concat('libs.min.js', {newLine: ';\r\n'}))
    .pipe(gulpif(options.env === 'production', uglify().on('error', gutil.log)))
    .pipe(gulpif(options.env === 'development', sourcemaps.write()))
    .pipe(gulp.dest('./www/'))
    .on('end', done);
});

gulp.task('sass', function(done) {
    var sass = require('gulp-sass');
    var autoprefixer = require('autoprefixer');
    var postcss = require('gulp-postcss');
    var minifyCss = require('gulp-minify-css');
    gulp.src(paths.sass)
    .pipe(plumber({errorHandler: done}))
    .pipe(sass())
    .pipe(postcss([autoprefixer({browsers: [
        'Android > 4',
        'Last 3 Chrome versions',
        'Last 3 Safari versions',
        'ChromeAndroid > 40',
        'Last 3 iOS versions',
    ]})]))
    .pipe(minifyCss({
        keepSpecialComments: 0,
    }))
    .pipe(rename({extname: '.min.css'}))
    .pipe(gulp.dest('./www/css/'))
    .on('end', done);
});

gulp.task('watch', function() {
    gulp.watch(paths.sass, ['sass']);
    gulp.watch(paths.scripts, ['scripts']);
    gulp.watch(paths.libs, ['libs']);
    gulp.watch(paths.templates, ['templates']);
    gulp.watch(paths.directives, ['directives']);
    gulp.watch('src/index.html', ['index']);
});

gulp.task('images', function(done) {
    gulp.src(paths.images)
    .pipe(gulp.dest('./www/css/images'))
    .on('end', done);
});

gulp.task('foss', function(done) {
    var map = require('map-stream');
    var markdown = require('gulp-markdown');
    gulp.src(['./{lib,plugins,node_modules/@ionic}/*/{license,LICENSE}*'])
    .pipe(markdown())
    .pipe(map(function(file, cb) {
        var fileContent = file.contents.toString();
        var title = file.relative
        .match(/[\\/](.*?)[\\/][^\\/]+$/)[1]
        .replace(/[\\/]/g, '-')
        .replace('@', '');
        file.contents = new Buffer(JSON.stringify({
            title: title,
            text:  fileContent,
        }));
        cb(null, file);
    }))
    .pipe(concat('licenses.json', {newLine: ',\r\n'}))
    .pipe(map(function(file, cb) {
        file.contents = new Buffer('[' + file.contents.toString() + ']');
        cb(null, file);
    }))
    .pipe(sortJSON({
        space: 1,
        cmp:   function(a, b) {
            console.log(a.key, b.key);
            return a.key === 'title' ? -1 : 1;
        },
        replacer: function(key, value) {
            if (value.sort) {
                value.sort(function(a, b) {
                    return a.title.toLowerCase() > b.title.toLowerCase() ? 1 : b.title.toLowerCase() > a.title.toLowerCase() ? -1 : 0;
                });
            }
            return value;
        },
    }))
    .pipe(gulp.dest('src/static'))
    .on('end', done);
});

gulp.task('bump', function() {
    require('gulp-cordova-bump').run({autofiles: true});
});
