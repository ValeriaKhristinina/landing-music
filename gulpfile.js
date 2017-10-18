const gulp = require('gulp')
const sass = require('gulp-sass')
const cleanCSS = require('gulp-clean-css')
const concat = require('gulp-concat')
const del = require('del')
var merge = require('merge-stream');
var minify = require('gulp-minify-css');

const browserSync = require('browser-sync').create()

const destName = 'public'

//cборка стилей
gulp.task('style', function () {
  //берёт файл style.scss

  var cssStream = gulp.src('./source/css/*.css')
    .pipe(concat('css-files.css'));

  var sassStream = gulp.src('./source/scss/style.scss')
    .pipe(sass()) // переводит scss в обычный css        
    .pipe(concat('saas-files.css')) // соединяем все файлы в один style.css
  //.pipe(cleanCSS({
  //    compatibility: 'ie8'
  //})) // минимизируем файл


  return merge(sassStream, cssStream)
    .pipe(concat('style.css'))
    .pipe(minify())
    .pipe(gulp.dest(destName + '/style'));

})

gulp.task('scripts', function () {
  return gulp.src('source/js/main.js')
    .pipe(gulp.dest(destName + '/js'))
})

// переносит все картинки и шрифты в public
gulp.task('assets', function () {
  return gulp.src('source/assets/**/*')
    .pipe(gulp.dest(destName))
})

//очищаем папку public
gulp.task('clean', function () {
  return del(destName)
})



//следит за измененим стилей и ассетсов, и если что-то в файлах изменилось, запускает соответсвующие задачи
gulp.task('watch', function () {
  gulp.watch('source/scss/**/*.*', gulp.series('style'))
  gulp.watch('source/assets/**/*.*', gulp.series('assets'))
  gulp.watch('source/js/**/*.*', gulp.series('scripts'))
})

gulp.task('serve', function () {
  browserSync.init({
    server: destName
  })

  browserSync.watch(destName + '/**/*.*').on('change', browserSync.reload)
})

//просто собирает проект
gulp.task('build', gulp.series('clean', 'style', 'assets', 'scripts'))

// собирает проект, а потом следит за изменениями
gulp.task('dev', gulp.series('build', gulp.parallel('watch', 'serve')))
