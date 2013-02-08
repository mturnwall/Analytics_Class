// assign assertion library
var assert = chai.assert,
	expect = chai.expect;
suite('live page testing', function (e) {
	var a, spy;
	console.log(e);
	setup(function () {
		spy = sinon.spy(window._gaq, 'push'),
		factorySpy = sinon.spy(GA, 'processFactoryOptions');
	});
	test('body was found', function () {
		var $_body = $('body');
		assert.equal($_body.length, 1, 'body element was not found');
	});
	test ('Print Page Links', function () {
		var $_link = $('a[data-analytics-type="printPage"]');
		$_link.trigger('click');
		expect(spy.calledWith(['_trackEvent', 'Print', 'current page'])).to.equal(true);
	});

	teardown(function () {
		spy.restore();
		factorySpy.restore();
	});
});