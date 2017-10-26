var app, base, concat, directory, gulp, gutil, hostname, path, refresh, sass, uglify, minifyCSS, imagemin, del, browserSync, autoprefixer, gulpSequence, shell, sourceMaps, plumber;

var autoPrefixBrowserList = ['last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'];

gulp        = require('gulp');
gutil       = require('gulp-util');
concat      = require('gulp-concat');
uglify      = require('gulp-uglify');
sass        = require('gulp-sass');
imagemin    = require('gulp-imagemin');
sourceMaps  = require('gulp-sourcemaps');
minifyCSS   = require('gulp-minify-css');
browserSync = require('browser-sync');
autoprefixer = require('gulp-autoprefixer');
gulpSequence = require('gulp-sequence').use(gulp);
shell       = require('gulp-shell');
plumber     = require('gulp-plumber');

gulp.task('browserSync', function() {
    browserSync({
        server: {
            baseDir: "app/"
        },
        options: {
            reloadDelay: 250
        },
        notify: false
    });
});

gulp.task('scripts', function() {
    return gulp.src(['app/scripts/src/_includes/**/*.js', 'app/scripts/src/**/*.js'])
                .pipe(plumber())
                .pipe(concat('app.js'))
                .on('error', gutil.log)
                .pipe(gulp.dest('app/scripts'))
                .pipe(browserSync.reload({stream: true}));
});

gulp.task('scripts-deploy', function() {
    return gulp.src(['app/scripts/src/_includes/**/*.js', 'app/scripts/src/**/*.js'])
                .pipe(plumber())
                .pipe(concat('app.js'))
                .pipe(uglify())
                .pipe(gulp.dest('dist/scripts'));
});

gulp.task('images', function(tmp) {
    gulp.src(['app/images/*.jpg', 'app/images/*.png'])
        .pipe(plumber())
        .pipe(imagemin({ optimizationLevel: 5, progressive: true, interlaced: true }))
        .pipe(gulp.dest('app/images'));
});

gulp.task('images-deploy', function() {
    gulp.src(['app/images/**/*', '!app/images/README'])
        .pipe(plumber())
        .pipe(gulp.dest('dist/images'));
});

gulp.task('styles', function() {
    return gulp.src('app/styles/scss/init.scss')
                .pipe(plumber({
                  errorHandler: function (err) {
                    console.log(err);
                    this.emit('end');
                  }
                }))
                .pipe(sourceMaps.init())
                .pipe(sass({
                      errLogToConsole: true,
                      includePaths: [
                          'app/styles/scss/'
                      ]
                }))
                .pipe(autoprefixer({
                   browsers: autoPrefixBrowserList,
                   cascade:  true
                }))
                .on('error', gutil.log)
                .pipe(concat('styles.css'))
                .pipe(sourceMaps.write())
                .pipe(gulp.dest('app/styles'))
                .pipe(browserSync.reload({stream: true}));
});

gulp.task('styles-deploy', function() {
    return gulp.src('app/styles/scss/init.scss')
                .pipe(plumber())
                .pipe(sass({
                      includePaths: [
                          'app/styles/scss',
                      ]
                }))
                .pipe(autoprefixer({
                  browsers: autoPrefixBrowserList,
                  cascade:  true
                }))
                .pipe(concat('styles.css'))
                .pipe(gulp.dest('dist/styles'));
});

gulp.task('html', function() {
    return gulp.src('app/*.html')
        .pipe(plumber())
        .pipe(browserSync.reload({stream: true}))
        .on('error', gutil.log);
});

gulp.task('html-deploy', function() {
    gulp.src('app/*')

        .pipe(plumber())
        .pipe(gulp.dest('dist'));

    gulp.src('app/.*')

        .pipe(plumber())
        .pipe(gulp.dest('dist'));

    gulp.src('app/fonts/**/*')

        .pipe(plumber())
        .pipe(gulp.dest('dist/fonts'));

    gulp.src(['app/styles/*.css', '!app/styles/styles.css'])
        .pipe(plumber())
        .pipe(gulp.dest('dist/styles'));
});

gulp.task('clean', function() {
    return shell.task([
      'rm -rf dist'
    ]);
});



gulp.task('scaffold', function() {
  return shell.task([
      'mkdir dist',
      'mkdir dist/fonts',
      'mkdir dist/images',
      'mkdir dist/scripts',
      'mkdir dist/styles'
    ]
  );
});

gulp.task('default', ['browserSync', 'scripts', 'styles'], function() {
    gulp.watch('app/scripts/src/**', ['scripts']);
    gulp.watch('app/styles/scss/**', ['styles']);
    gulp.watch('app/images/**', ['images']);
    gulp.watch('app/*.html', ['html']);
});

gulp.task('deploy', gulpSequence('clean', 'scaffold', ['scripts-deploy', 'styles-deploy', 'images-deploy'], 'html-deploy'));
