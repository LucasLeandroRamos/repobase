const gulp        = require('gulp');
const sass        = require('gulp-sass');
const browserSync = require('browser-sync');
const uglify      = require('gulp-uglify');
const rename      = require('gulp-rename');
const filter      = require('gulp-filter');
const plumber     = require('gulp-plumber');
const pug         = require('gulp-pug');

const paths = {
  src: './src',
  build: './public/build',
  public: './public',
};

gulp.task('clean', () => {
  //-----------------
});

gulp.task('sass', () => {
  return gulp.src(paths.src + '/sass/style.scss')
    .pipe(plumber())
    .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest(paths.build + '/styles'))
    .pipe(browserSync.reload({ stream: true }));
});

gulp.task('scripts', () => {
  gulp.src(paths.src + '/scripts/scripts.js')
    .pipe(plumber())
    .pipe(uglify())
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest(paths.build + '/scripts'))
    .pipe(browserSync.reload({ stream: true, once: true }));
});

gulp.task('views', () => {
  gulp.src(paths.src + '/views/**/*.pug')
    .pipe(plumber())
    .pipe(filter(file => (
      !/\/_/.test(file.path) && !/^_/.test(file.relative)
    )))
    .pipe(pug())
    .pipe(gulp.dest(paths.public));
});

gulp.task('images', () => {
  gulp.src([paths.src + '/images/**/*'])
    .pipe(gulp.dest(paths.build + '/images'));
});

gulp.task('browser-sync', () => {
  browserSync.init(null, {
    server: {
      baseDir: paths.public,
    },
    files: [paths.public + '/**/*']
  });
});

gulp.task('default', ['clean', 'sass', 'images', 'scripts', 'views']);

gulp.task('watch', ['clean', 'sass', 'images', 'scripts', 'views', 'browser-sync'], () => {
  gulp.watch(paths.src + '/sass/**/*.scss', ['sass']);
  gulp.watch(paths.src + '/scripts/*.js', ['scripts']);
  gulp.watch(paths.src + '/views/**/*.pug', ['views']);
  gulp.watch(paths.src + '/views/**/*.md', ['views']);
  gulp.watch(paths.src + '/images/**/*', ['images']);
});
