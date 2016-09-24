var fs = require('fs');
var jsdom = require('jsdom');

var jquery = fs.readFileSync('./src/js/jquery-2.2.4.min.js', 'utf8');
var html = fs.readFileSync('./data/raw/in.html', 'utf8');

jsdom.env({
	html: html,
	src: [jquery],
	done: function (err, window) {
		var $ = window.$;

		// Parse here
		var result = [];

		fs.writeFile('./out/result.json', JSON.stringify(result, null, 2), 'utf8', function(err) {
			if (err) throw err;

			console.log('json saved');
		});
	}
});