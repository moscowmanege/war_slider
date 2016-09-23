var gulp = require('gulp'),
		data = require('gulp-data'),
		foreach = require('gulp-foreach'),
		rename = require('gulp-rename'),
		jade = require('gulp-jade'),
		stylus = require('gulp-stylus'),
		plumber = require('gulp-plumber'),
		autoprefixer = require('gulp-autoprefixer');

var path = require('path'),
		fs = require('fs'),
		rimraf = require('rimraf'),
		colors = require('colors'),
		runSequence = require('run-sequence');


// Paths Block


var paths = {
	scripts: {
		src: 'src/js/**/*',
		dest: 'build/js'
	},
	stylus: {
		src: 'src/styl/**/[^_]*.{styl,css}',
		dest: 'build/css'
	},
	html: {
		src: 'src/index.jade',
		dest: 'build/html'
	},
	data: {
		src: 'data/*.json'
	}
};


// vars Block


var Production = false;


// Loggers Block


var error_logger = function(error) {
	console.log([
		'',
		'---------- ERROR MESSAGE START ----------'.bold.red.inverse,
		'',
		(error.name.red + ' in ' + error.plugin.yellow),
		'',
		error.message,
		'----------- ERROR MESSAGE END -----------'.bold.red.inverse,
		''
	].join('\n'));
};


// Handlers Block


var getJsonData = function(file) {
	return JSON.parse(fs.readFileSync(file.path));
};


// Tasks Block


gulp.task('production', function(callback) {
	Production = true;
	callback();
});

gulp.task('clean', function(callback) {
	return rimraf('build/**', callback);
});

gulp.task('jade', function() {
	return gulp.src(paths.data.src)
		.pipe(plumber(error_logger))
		.pipe(foreach(function(stream, file){
				var jsonFile = file; // We create this 'jsonFile' variable because the 'file' variable is overwritten on the next gulp.src.
				var jsonBasename = path.basename(jsonFile.path, path.extname(jsonFile.path));
				return gulp.src(paths.html.src)
					.pipe(plumber(error_logger))
					.pipe(data(getJsonData(jsonFile)))
					.pipe(jade({ pretty: !Production }))
					.pipe(rename(function(htmlFile) {
						htmlFile.basename = jsonBasename;
					}))
					.pipe(gulp.dest(paths.html.dest));
			})
		);
});

gulp.task('stylus', function() {
	return gulp.src(paths.stylus.src)
		.pipe(plumber(error_logger))
		.pipe(stylus({ compress: Production }))
		.pipe(autoprefixer({
			browsers: ['last 2 versions'],
			cascade: !Production
		}))
		.pipe(gulp.dest(paths.stylus.dest));
});

gulp.task('scripts', function() {
	return gulp.src(paths.scripts.src)
		.pipe(plumber(error_logger))
		.pipe(gulp.dest(paths.scripts.dest));
});


// Run Block


gulp.task('default', function(callback) {
	runSequence('clean', ['jade', 'stylus', 'scripts'], callback);
});

gulp.task('build', function(callback) {
	runSequence('production', 'clean', ['jade', 'stylus', 'scripts'], callback);
});
