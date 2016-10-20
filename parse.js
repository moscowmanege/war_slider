var fs = require('fs');
var jsdom = require('jsdom');

var jquery = fs.readFileSync('./src/js/jquery-2.2.4.min.js', 'utf8');
var html = fs.readFileSync('./data/raw/in.html', 'utf8');

jsdom.env({
	html: html,
	src: [jquery],
	done: function (err, window) {
		var $ = window.$;

		var result = $('tr').slice(1).map(function() {
			var td = $(this).children('td');

			return {
				hall: +td.eq(15).text().replace(/\t+/g, '').replace(/\n/g, ' ').trim().replace('Павильон № ', ''),
				file_name: td.eq(6).text().replace(/\t+/g, '').replace(/\n/g, ' ').trim(),

				ru: {
					title: td.eq(0).text().replace(/\t+/g, '').replace(/\n/g, ' ').trim(),
					description: td.eq(1).text().replace(/\t+/g, '').replace(/\n/g, ' ').trim(),
					description_alt: td.eq(2).text().replace(/\t+/g, '').replace(/\n/g, ' ').trim(),
					place_year: td.eq(3).text().replace(/\t+/g, '').replace(/\n/g, ' ').trim(),
					museum: td.eq(4).text().replace(/\t+/g, '').replace(/\n/g, ' ').trim(),
					size_mat: td.eq(5).text().replace(/\t+/g, '').replace(/\n/g, ' ').trim(),
					complex: td.eq(7).text().replace(/\t+/g, '').replace(/\n/g, ' ').trim(),
				},

				en: {
					title: td.eq(8).text().replace(/\t+/g, '').replace(/\n/g, ' ').trim(),
					description: td.eq(9).text().replace(/\t+/g, '').replace(/\n/g, ' ').trim(),
					description_alt: td.eq(10).text().replace(/\t+/g, '').replace(/\n/g, ' ').trim(),
					place_year: td.eq(11).text().replace(/\t+/g, '').replace(/\n/g, ' ').trim(),
					museum: td.eq(12).text().replace(/\t+/g, '').replace(/\n/g, ' ').trim(),
					size_mat: td.eq(13).text().replace(/\t+/g, '').replace(/\n/g, ' ').trim(),
					complex: td.eq(14).text().replace(/\t+/g, '').replace(/\n/g, ' ').trim(),
				}

			}
		}).toArray();

		fs.writeFile('./data/raw/result.json', JSON.stringify(result, null, 2), 'utf8', function(err) {
			if (err) throw err;

			console.log('json saved');
		});
	}
});