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
	test ('Test Me Link', function () {
		var $_link = $('a[data-analytics-type="testMe"]'),
			info = $_link.data('analytics-info');
		$_link.trigger('click');
		expect(spy.calledWith(['_trackEvent', 'Test', 'current page', info])).to.equal(true);
	});
	test ('Social Link', function () {
		var $_link = $('a[data-analytics-type="social"]'),
			info = $_link.data('analytics-info');
		$_link.trigger('click');
		expect(spy.calledWith(['_trackSocial', info])).to.equal(true);
	});

	teardown(function () {
		spy.restore();
		factorySpy.restore();
	});
});