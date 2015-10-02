/* jshint node: true */
var gulp = require('gulp');
var gutil = require('gulp-util');
var bower = require('bower');
var concat = require('gulp-concat');
var sourcemaps = require('gulp-sourcemaps');
var sass = require('gulp-sass');
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');
var sh = require('shelljs');
var uglify = require('gulp-uglify');
var gulpif = require('gulp-if');
var minimist = require('minimist');
var phonegapBuild = require('gulp-phonegap-build');
var inquirer = require('inquirer');

var knownOptions = {
    string: 'env',
    default: {
        env: process.env.NODE_ENV || 'production'
    }
};

var options = minimist(process.argv.slice(2), knownOptions);

var paths = {
    static: ['./src/static/**.*'],
    sass: ['./scss/**/*.scss'],
    scripts: [
        './src/app.js',
        './src/components/**/*.js',
        './src/services/**/*.js',
        './src/directives/**/*.js',
        './src/lib/**/*.js'
    ],
    libs: [
        './lib/ionic/js/ionic.bundle.js',
        './lib/angular-i18n/angular-locale_sv-se.js',
        './lib/ngCordova/dist/ng-cordova.js',
        './src/lib/polyfill.js',
        './lib/ionic-ion-header-shrink/ionic.headerShrink.js',
        './lib/angular-messages/angular-messages.js',
        './lib/imgcache.js/js/imgcache.js',
        './lib/angular-imgcache.js/angular-imgcache.js',
        './lib/leaflet/dist/leaflet-src.js',
        './lib/angular-leaflet-directive/dist/angular-leaflet-directive.js',
        './lib/leaflet-plugins/layer/Marker.Rotate.js',
        './lib/leaflet.markercluster/dist/leaflet.markercluster.js',
        './lib/ionic-tabslidebox/tabSlideBox.js',
        './lib/leaflet.locatecontrol/dist/L.Control.Locate.min.js',
        './lib/Leaflet.awesome-markers/dist/leaflet.awesome-markers.js'
    ],
    templates: ['src/components/**/*.html'],
    directives: ['src/directives/**/*.html']
};

gulp.task('default', [
    'sass',
    'scripts',
    'libs',
    'fonts',
    'templates',
    'directives',
    'static',
    'images'
]);

gulp.task('scripts', function(done) {
    gulp.src(paths.scripts)
    .pipe(gulpif(options.env === 'development', sourcemaps.init()))
    .pipe(concat('all.min.js', {newLine: ';\r\n'}))
    .pipe(gulpif(options.env === 'production', uglify()))
    .pipe(gulpif(options.env === 'development', sourcemaps.write()))
    .pipe(gulp.dest('./www/'))
    .on('end', done);
});

gulp.task('fonts', function(done) {
    gulp.src([
        'lib/ionic/fonts/**/*.{ttf,woff,eof,svg,eot}',
        'lib/font-awesome/fonts/**/*.{ttf,woff2,eof,svg,eot}'
    ])
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

gulp.task('static', function(done) {
    gulp.src(paths.static)
    .pipe(gulp.dest('./www/static'))
    .on('end', done);
});

gulp.task('libs', function(done) {
    gulp.src(paths.libs)
    .pipe(gulpif(options.env === 'development', sourcemaps.init()))
    .pipe(concat('libs.min.js', {newLine: ';\r\n'}))
    .pipe(gulpif(options.env === 'production', uglify()))
    .pipe(gulpif(options.env === 'development', sourcemaps.write()))
    .pipe(gulp.dest('./www/'))
    .on('end', done);
});

gulp.task('sass', function(done) {
    gulp.src('./scss/*.scss')
    .pipe(sass({
        errLogToConsole: true
    }))
    .pipe(minifyCss({
        keepSpecialComments: 0
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
});

gulp.task('install', ['git-check'], function() {
    return bower.commands.install()
    .on('log', function(data) {
        gutil.log('bower', gutil.colors.cyan(data.id), data.message);
    });
});

gulp.task('images', function(done) {
    gulp.src([
        './lib/Leaflet.awesome-markers/dist/images/*',
        './lib/leaflet/dist/images/*'
    ])
    .pipe(gulp.dest('./www/css/images'))
    .on('end', done);
});

gulp.task('git-check', function(done) {
    if (!sh.which('git')) {
        console.log(
            '  ' + gutil.colors.red('Git is not installed.'),
            '\n  Git, the version control system, is required to download Ionic.',
            '\n  Download git here:', gutil.colors.cyan('http://git-scm.com/downloads') + '.',
            '\n  Once git is installed, run \'' + gutil.colors.cyan('gulp install') + '\' again.'
        );
        process.exit(1);
    }
    done();
});
gulp.task('deploy', ['default'], function(done) {
    var email = 'app@ifiske.se';
    inquirer.prompt({
        type: 'password',
        name: 'pass',
        message: 'Enter password for ' + email
    }, function(response) {
        gulp.src(['./www/**/*', './resources/**/*'], {base: '.', dot: true})
        .pipe(phonegapBuild({
            'appId': '1642930',
            'user': {
                'email': email,
                'password': response.pass
            }
        }))
        .on('end', done);

    });
});
