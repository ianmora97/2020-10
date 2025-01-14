var gulp        = require('gulp');
var sass        = require('gulp-sass');
var concat      = require('gulp-concat');
var browserSync = require('browser-sync').create();

// Compile sass into CSS & auto-inject into browsers
gulp.task('sass', function() {
    return gulp.src("web/scss/*.scss")
        .pipe(sass())
        .pipe(gulp.dest("web/css"))
        .pipe(browserSync.stream());
});

// move animate.css to web/css
gulp.task('animate', function() {
    return gulp.src('node_modules/animate.css/animate.css')
        .pipe(concat('animate.css'))
        .pipe(gulp.dest("web/css"));
});

// move bootstrap JS and Jquery
gulp.task('js', function() {
    return gulp.src([
            'node_modules/jquery/dist/jquery.js',
            'node_modules/bootstrap/dist/js/bootstrap.bundle.js'
        ])
        .pipe(concat('jq-bs-bundle.js'))
        .pipe(gulp.dest('web/js'));
});

// fullCalendar JS
gulp.task('fcjs', function() {
    return gulp.src([
            'node_modules/fullcalendar/main.js'
        ])
        .pipe(concat('fullcalendar.js'))
        .pipe(gulp.dest('web/js'));
});

// fullCalendar CSS
gulp.task('fccss', function() {
    return gulp.src([
            'node_modules/fullcalendar/main.css'
        ])
        .pipe(concat('fullcalendar.css'))
        .pipe(gulp.dest('web/css'));
});


// watching scss/html files
gulp.task('serve', gulp.series('sass','js','animate','fcjs','fccss', function() {
    gulp.watch("web/scss/*.scss", gulp.series('sass'));
}));
// gulp.task('dev', gulp.series('sass','js','animate','nodemon', function() {
//     browserSync.init(null, {
// 		proxy: "http://localhost:80",
//         files: ["web/views/**/*.*"],
//         open: false,
//         notify: false,
//         ui:false,
//         port: 3000,
// 	});
//     gulp.watch("web/scss/*.scss", gulp.series('sass'));
//     gulp.watch("web/views/*.ejs").on('change', browserSync.reload);
//     gulp.watch("web/css/*.css").on('change', browserSync.reload);
// }));

gulp.task('default', gulp.series('serve'));