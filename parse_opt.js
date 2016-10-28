var fs = require('fs');
var jsdom = require('jsdom');
var rimraf = require('rimraf');
var async = require('async');

var jquery = fs.readFileSync('./src/js/jquery-2.2.4.min.js', 'utf8');

var main = fs.readFileSync('./data/raw/main.html', 'utf8');
var opt = fs.readFileSync('./data/raw/opt.html', 'utf8');

var uniq = function(a) {
	return a.sort().filter(function(item, pos, ary) {
		return !pos || item != ary[pos - 1];
	});
};

rimraf.sync('./data/halls/*');

var parseFile = function(window, base_path) {
	var $ = window.$;

	var array = $('tr').slice(1).map(function() {
		var td = $(this).children('td');

		return {
			hall: +td.eq(15).text().replace(/\t+/g, '').replace(/\n/g, ' ').trim().replace('Павильон № ', ''),
			path: td.eq(6).text().replace(/\t+/g, '').replace(/\n/g, ' ').trim(),

			ru: {
				title: td.eq(0).text().replace(/\t+/g, '').replace(/\n/g, ' ').trim(),
				description: td.eq(1).text().replace(/\t+/g, '').replace(/\n/g, ' ').trim(),
				description_alt: td.eq(2).text().replace(/\t+/g, '').replace(/\n/g, ' ').trim(),
				year_place: td.eq(3).text().replace(/\t+/g, '').replace(/\n/g, ' ').trim(),
				museum: td.eq(4).text().replace(/\t+/g, '').replace(/\n/g, ' ').trim(),
				size_mat: td.eq(5).text().replace(/\t+/g, '').replace(/\n/g, ' ').trim(),
				complex: td.eq(7).text().replace(/\t+/g, '').replace(/\n/g, ' ').trim(),
			},

			en: {
				title: td.eq(8).text().replace(/\t+/g, '').replace(/\n/g, ' ').trim(),
				description: td.eq(9).text().replace(/\t+/g, '').replace(/\n/g, ' ').trim(),
				description_alt: td.eq(10).text().replace(/\t+/g, '').replace(/\n/g, ' ').trim(),
				year_place: td.eq(11).text().replace(/\t+/g, '').replace(/\n/g, ' ').trim(),
				museum: td.eq(12).text().replace(/\t+/g, '').replace(/\n/g, ' ').trim(),
				size_mat: td.eq(13).text().replace(/\t+/g, '').replace(/\n/g, ' ').trim(),
				complex: td.eq(14).text().replace(/\t+/g, '').replace(/\n/g, ' ').trim(),
			}

		};
	}).toArray();

	var halls = array.map(function(item) {
		return item.hall;
	});

	uniq(halls).forEach(function(item) {
		var items = array.filter(function(check_item) { return (check_item.hall == item && check_item.path != ''); });

		var complexes = items.map(function(cx_item) {
			return cx_item.ru.complex;
		});

		var complex_items = uniq(complexes).map(function(complex) {
			var elems = items.filter(function(c_item) { return c_item.ru.complex == complex; });
			return {
				title: {
					ru: elems[0].ru.complex,
					en: elems[0].en.complex
				},
				elems: elems
			};
		});

		var hall = {
			hall: item,
			base_path: base_path,
			blocks: complex_items
		};

		fs.writeFile('./data/halls/' + item + '.json', JSON.stringify(hall, null, 2), 'utf8', function(err) {
			if (err) throw err;

			console.log('json item ' + item + ' saved');
		});
	});
};

async.parallel({
	main: function(callback) {
		jsdom.env({
			html: main,
			src: [jquery],
			done: callback
		});
	},
	opt: function(callback) {
		jsdom.env({
			html: opt,
			src: [jquery],
			done: callback
		});
	}
}, function(err, results) {
	async.parallel([
		async.apply(parseFile, results.main.window, 'main'),
		async.apply(parseFile, results.opt.window, 'opt')
	]);
});