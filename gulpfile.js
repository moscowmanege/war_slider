var gulp = require('gulp'),
		noop = require('gulp-noop'),
		cache = require('gulp-cached'),
		data = require('gulp-data'),
		each = require('gulp-each'),
		rename = require('gulp-rename'),
		progeny = require('gulp-progeny'),
		pug = require('gulp-pug'),
		stylus = require('gulp-stylus'),
		uglify = require('gulp-uglify'),
		filter = require('gulp-filter'),
		autoprefixer = require('gulp-autoprefixer');

var path = require('path'),
		fs = require('fs'),
		rimraf = require('rimraf'),
		pump = require('pump'),
		colors = require('ansi-colors'),
		argv = require('minimist')(process.argv.slice(2)),
		log = require('fancy-log');


// ENV Block


var Prod = argv.p || argv.prod;


// Paths Block


var paths = {
	scripts: {
		src: 'src/js/**/*.{js,map}',
		dest: 'build/js'
	},
	styles: {
		src: 'src/styl/**/*.{styl,css}',
		dest: 'build/css'
	},
	html: {
		src: 'src/index.pug',
		dest: 'build/html'
	},
	data: {
		src: 'data/halls/*.json'
	}
};


// Loggers Block


var errorLogger = function(err) {
	if (err) log([
		'',
		colors.bold.inverse.red('---------- ERROR MESSAGE START ----------'),
		'',
		(colors.red(err.name) + ' in ' + colors.yellow(err.plugin)),
		'',
		err.message,
		colors.bold.inverse.red('----------- ERROR MESSAGE END -----------'),
		''
	].join('\n'));
};

var watchLogger = function(e_type) {
	return function(path, stats) {
		log([
			'File ',
			colors.green(path.replace(__dirname + '/', '')),
			' was ',
			colors.yellow(e_type),
			', running tasks...'
		].join(''));
	};
};

var cacheClean = function(path) {
	delete cache.caches.scripts[path];
	delete cache.caches.styles[path];
};


// Handlers Block


var getJsonData = function(file) {
	return JSON.parse(fs.readFileSync(file.path));
};


// Tasks Block


function clean(callback) {
	return rimraf('build/**', callback);
}

function html() {
	return pump([
		gulp.src(paths.data.src),
			each(function(content, file, callback) {
				var jsonFile = file; // We create this 'jsonFile' variable because the 'file' variable is overwritten on the next gulp.src.
				var jsonBasename = path.basename(jsonFile.path, path.extname(jsonFile.path));
				return pump([
					gulp.src(paths.html.src),
						data(getJsonData(jsonFile)),
						pug({ pretty: !Prod }),
						rename(function(htmlFile) {
							htmlFile.basename = jsonBasename;
						}),
					gulp.dest(paths.html.dest)
				], callback);
			})
	], errorLogger);
}

function styles() {
	return pump([
		gulp.src(paths.styles.src),
			cache('styles'),
			progeny(),
			filter(['**/*.{styl,css}', '!**/_*.styl']),
			stylus({ compress: Prod }),
			autoprefixer({
				browsers: ['last 12 versions'],
				cascade: !Prod
			}),
		gulp.dest(paths.styles.dest)
	], errorLogger);
}

function scripts() {
	return pump([
		gulp.src(paths.scripts.src),
			cache('scripts'),
			Prod ? uglify() : noop(),
		gulp.dest(paths.scripts.dest)
	], errorLogger);
}

function watch() {
	gulp.watch(paths.scripts.src, scripts)
			.on('unlink', cacheClean)
			.on('change', watchLogger('changed'))
			.on('add', watchLogger('added'))
			.on('unlink', watchLogger('removed'));

	gulp.watch(paths.styles.src, styles)
			.on('unlink', cacheClean)
			.on('change', watchLogger('changed'))
			.on('add', watchLogger('added'))
			.on('unlink', watchLogger('removed'));

	gulp.watch(paths.html.src, html)
			.on('change', watchLogger('changed'))
			.on('add', watchLogger('added'))
			.on('unlink', watchLogger('removed'));
}


// Run Block


exports.build = gulp.series(clean, gulp.parallel(styles, scripts, html));
exports.default = gulp.series(clean, gulp.parallel(styles, scripts, html), watch);