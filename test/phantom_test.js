var page =  require('webpage').create();
page.settings = {
	userName: 'MarineMax',
	password: 'MarineMax12!'
};
// page.onResourceRequested = function (request) {
//     console.log('Request ' + JSON.stringify(request, undefined, 4));
// };
// page.onResourceReceived = function (response) {
//     console.log('Receive ' + JSON.stringify(response, undefined, 4));
// };
page.open('http://marinemax.digitaria.com/boats/details/4187897/new/sea-ray-190-sport.aspx', function (s) {
	page.injectJs("libs/mocha.js");
	page.injectJs("libs/chai.js");
	page.injectJs("libs/sinon.js");
	page.injectJs("libs/jquery-1.8.3.js");
	if (page.injectJs("libs/reporter.js")) {
		// console.log('reporter loaded');
	}
	if (page.injectJs("tests.js")) {
		// console.log('tests file loaded');
	}
});

page.onCallback = function(data) {
    data.message && console.log(data.message);
    data.exit && phantom.exit();
};
page.onLoadFinished = function(status) {
    console.log('Status: ' + status);
	page.evaluate(function () {
		console.log('evaluate');
		GA.init();
		window.mocha.run();
	});
};