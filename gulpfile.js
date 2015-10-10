var gulp = require('gulp');
var concat = require('gulp-concat');
var CacheBuster = require('gulp-cachebust');
var templateCache = require('gulp-angular-templatecache');
var clean = require('gulp-rimraf');
var sourcemaps = require('gulp-sourcemaps');
var cssmin = require('gulp-minify-css');
var uglify = require('gulp-uglify');
var cached = require('gulp-cached');
var remember = require('gulp-remember');

var source = {
  css : 'public/stylesheets/*.css',
  app: ['public/build/templates.js','public/app/main.js','public/app/**/*.js'],
  templates: 'public/app/templates/*.html'
};

var vendor = [
  'bower_components/angular/angular.min.js',
  'bower_components/angular-route/angular-route.min.js',
  'bower_components/ng-file-upload/ng-file-upload.all.min.js'
]

var dist = 'public/build';

var cachebust = new CacheBuster();

gulp.task('build', ['minifycss','cache-template','angularify','bundle'], function(){

})

gulp.task('bundle', function(){
    return gulp
      .src(['public/build/build.js,public/build/vendor.js'])
      .pipe(concat('bundle.min.js'))
})

gulp.task('watch', ['vendor'], function(){
  gulp.watch(source.css, ['minifycss']);
  gulp.watch(source.app, ['js','bundle']);
})

gulp.task('minifycss', function(){
  return gulp
    .src(source.css)
    .pipe(cachebust.resources())
    .pipe(sourcemaps.init())
      .pipe(concat('build.css'))
    .pipe(cssmin())
    .pipe(sourcemaps.write('/'))
    .pipe(gulp.dest(dist));
})

gulp.task('vendor', function(){
  return gulp
    .src(vendor)
    .pipe(sourcemaps.init())
    .pipe(concat('vendor.js'))
    .pipe(sourcemaps.write('/'))
    .pipe(gulp.dest(dist))
})


gulp.task('js', ['cache-template'], function(){
  return gulp
    .src(source.app)
    .pipe(cached('scripts'))
      .pipe(cachebust.resources())
      .pipe(sourcemaps.init())
    .pipe(remember('scripts'))
    .pipe(uglify())
    .pipe(concat('build.js'))
    .pipe(sourcemaps.write('/'))
    .pipe(gulp.dest(dist))
})


// templateCache injection of views
gulp.task('cache-template', function(){
  return gulp
    .src(source.templates)
    .pipe(templateCache({standalone:true}))
    .pipe(gulp.dest(dist))
})

gulp.task('default', ['watch']);
