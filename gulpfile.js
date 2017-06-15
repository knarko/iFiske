/* jshint node: true */
var gulp = require('gulp');
var gutil = require('gulp-util');
var concat = require('gulp-concat');
var sourcemaps = require('gulp-sourcemaps');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var gulpif = require('gulp-if');
var minimist = require('minimist');
var ngAnnotate = require('gulp-ng-annotate');
var plumber = require('gulp-plumber');
var sortJSON = require('gulp-json-sort').default;
var babel = require('gulp-babel');
var expectFile = require('gulp-expect-file');
var templateCache = require('gulp-angular-templatecache');

var knownOptions = {
    string:  'env',
    default: {
        env: process.env.NODE_ENV || 'production',
    },
};

var options = minimist(process.argv.slice(2), knownOptions);

var paths = {
    sass:  ['./src/scss/**/*.scss'],
    fonts: [
        'node_modules/ionic-angular/release/fonts/*.{woff,otf,ttf}',
        'src/scss/fonts/ifiske.ttf',
    ],
    images: [
        'node_modules/drmonty-leaflet-awesome-markers/css/images/*',
        'node_modules/leaflet/dist/images/*',
    ],
    scripts: [
        'src/io-config.js',
        'src/app.js',
        'src/states.js',
        'src/components/**/*.js',
        'src/services/**/*.js',
        'src/directives/**/*.js',
        'src/models/**/*.js',
        'src/translations/*.js',
    ],
    libs: [
        'src/lib/polyfill.js',

        'node_modules/ionic-angular/release/js/ionic.bundle.js',
        'node_modules/@ionic/cloud/dist/bundle/ionic.cloud.js',
        'node_modules/ionic-ion-header-shrink/ionic.headerShrink.js',

        'node_modules/ng-cordova/dist/ng-cordova.js',

        'node_modules/angular-i18n/angular-locale_sv.js',
        // TODO: Allow for other locales maybe?
        'node_modules/angular-messages/angular-messages.js',
        'node_modules/angular-simple-logger/dist/angular-simple-logger.js',

        'node_modules/imgcache.js/js/imgcache.js',
        'node_modules/angular-imgcache.js/angular-imgcache.js',

        'node_modules/angular-translate/dist/angular-translate.js',
        'node_modules/angular-translate-handler-log/angular-translate-handler-log.js',

        'node_modules/leaflet/dist/leaflet-src.js',
        'node_modules/leaflet.markercluster/dist/leaflet.markercluster-src.js',
        'node_modules/leaflet.locatecontrol/dist/L.Control.Locate.min.js',
        'node_modules/drmonty-leaflet-awesome-markers/js/leaflet.awesome-markers.js',
        'node_modules/leaflet-popup-angular/src/L.Popup.Angular.js',

        'node_modules/moment/moment.js',
        'node_modules/moment/locale/sv.js',
        'node_modules/moment/locale/en-gb.js',
        'node_modules/moment/locale/de.js',
        'node_modules/chart.js/dist/Chart.js',
        'node_modules/angular-chart.js/dist/angular-chart.js',
        'node_modules/fuse.js/dist/fuse.js',
    ],
    templates: ['src/**/*.html'],
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
        // .pipe(expectFile(paths.scripts))
        .pipe(gulpif(options.env === 'development', sourcemaps.init()))
        .pipe(babel({
            presets: ['es2015'],
            plugins: ['ng-annotate'],
        }))
        .pipe(ngAnnotate())
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

gulp.task('templates', function(done) {
    gulp.src(paths.templates)
        .pipe(templateCache({
            standalone: true,
            base:       __dirname + '/src',
        }))
        .pipe(gulp.dest('./www'))
        .on('end', done);
});

gulp.task('libs', function(done) {
    gulp.src(paths.libs)
        .pipe(plumber({errorHandler: done}))
        // .pipe(expectFile(paths.libs))
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
        .pipe(postcss([autoprefixer({
            browsers: [
                'Android > 4',
                'Last 3 Chrome versions',
                'Last 3 Safari versions',
                'ChromeAndroid > 40',
                'Last 3 iOS versions',
            ],
        })]))
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
        .pipe(gulp.dest('www/static'))
        .on('end', done);
});

gulp.task('bump', function() {
    require('gulp-cordova-bump').run({
        packageJson: 'package.json',
        configXml:   'config.xml',
    });
});

var conventionalChangelog = require('gulp-conventional-changelog');

gulp.task('changelog', changelog);
function changelog() {
    return gulp.src('CHANGELOG.md')
        .pipe(conventionalChangelog({
            // conventional-changelog options go here
            preset: 'angular',
        }, {
                // context goes here
        }, {
                // git-raw-commits options go here
        }, {
                // conventional-commits-parser options go here
        }, {
                // conventional-changelog-writer options go here
        }))
        .pipe(gulp.dest('./'));
}

function setIosBuild(version) {
    var xmlTransformer = require('gulp-xml-transformer');
    return xmlTransformer([{
        path:  '.',
        attrs: {
            'ios-CFBundleVersion': function(val) {
                if (version) {
                    val = version;
                }
                return val.replace(/^(\d+\.\d+\.\d+).(\d+)$/, function(_, p1, p2) {
                    return p1 + '.' + (Number(p2) + 1);
                });
            },
        },
    }]);
}
gulp.task('updateBuildVersion', [], function() {
    gulp.src('./config.xml')
        .pipe(setIosBuild())
        .pipe(gulp.dest('./'));
});
gulp.task('release', [], function() {
    var conventionalRecommendedBump = require('conventional-recommended-bump');
    conventionalRecommendedBump({
        preset: 'angular',
    }, function(err, result) {
        if (err) {
            console.error(err);
            throw err;
        }
        var bumpConfig = {
            packageJson: 'package.json',
            configXml:   'config.xml',
        };
        console.log(result.reason);
        bumpConfig[result.releaseType] = true;
        require('gulp-cordova-bump').run(bumpConfig);
        changelog();
        // TODO: Make a git commit with the changelog and tag it
    });
});

gulp.task('ionic:build:before', ['default']);
gulp.task('ionic:watch:before', ['default', 'watch']);
