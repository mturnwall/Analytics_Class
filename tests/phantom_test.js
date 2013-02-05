var page =  require('webpage').create();
// page.onResourceRequested = function (request) {
//     console.log('Request ' + JSON.stringify(request, undefined, 4));
// };
// page.onResourceReceived = function (response) {
//     console.log('Receive ' + JSON.stringify(response, undefined, 4));
// };
page.open('http://localhost/repos/analytics_class/tests/', function (s) {
	console.log(s);
	console.log(mocha);
	page.injectJs("lib/reporter.js");
	page.evaluate(function () {
		window.mocha.run();
	});
	phantom.exit();
});