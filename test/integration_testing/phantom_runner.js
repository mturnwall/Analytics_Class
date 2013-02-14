var count = 0,
	errCount = false,
	pages = [
		{
			url: 'http://projects.turnwall.net/Analytics_Class/demo/',
			tests: 'integration_test.js'
		},
		{
			url: 'http://projects.turnwall.net/Analytics_Class/demo/',
			tests: 'integration_test2.js'
		}
	],
	processPage = function (url) {
		var page =  require('webpage').create();
		// use this to pass login credentials to the server
		// page.settings = {
		//	userName: 'MarineMax',
		//	password: 'MarineMax12!'
		// };

		page.open(url, function (s) {
			page.injectJs('../libs/mocha.js');
			page.injectJs('../libs/chai.js');
			page.injectJs('../libs/sinon.js');
			page.injectJs('../libs/jquery-1.8.3.js');
			page.injectJs('../libs/reporter.js');
			page.injectJs(pages[count].tests);
		});
		page.onCallback = function(data) {
			if (data.message) {
				console.log(data.message);
			}
			if (data.exit) {
				count += 1;
				if (count < pages.length) {
					page.close();
					processPage(pages[count].url);
				} else {
					phantom.exit();
				}
			}
		};
		page.onLoadFinished = function(status) {
			console.log('Status: ' + status);
			page.evaluate(function () {
				console.log('evaluate');
					GA.init();
				window.mocha.run();
			});
		};
	};
processPage(pages[count].url);
