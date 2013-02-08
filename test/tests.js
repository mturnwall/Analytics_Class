// assign assertion library
var assert = chai.assert,
	expect = chai.expect;
suite('live page testing', function () {
	var a, spy;
	setup(function () {
		spy = sinon.spy(window._gaq, 'push'),
		factorySpy = sinon.spy(GA, 'processFactoryOptions');
	});
	test ('body was found', function () {
		var $_body = $('body');
		assert.equal($_body.length, 1, 'body element was not found');
	});
	test ('Print Page Links', function () {
		var $_link = $('a[data-analytics-type="printPage"]');
		$_link.trigger('click');
		expect(spy.calledWith(['_trackEvent', 'Print', 'current page'])).to.equal(true);
	});

	test ('Request More Information Links', function () {
		var $_link = $('a[data-analytics-type="requestInfo"]'),
			info = $_link.data('analytics-info');
		$_link.trigger('click');
		expect(spy.calledWith(['_trackEvent', 'Request More Information', 'link', info])).to.equal(true);
	});

	teardown(function () {
		spy.restore();
		factorySpy.restore();
	});
});