/*
	Testing that links with custom tracking events are tracked correctly
 */
(function () {
	suite('Custom Events', function () {
		var a, spy;
		setup(function () {
			a = $('<a/>', {
				id: 'customLink',
				href: 'http://www.example.com',
				text: 'Custom Event Link',
				'data-analytics-type': 'printPage',
				'data-analytics-info': 'Print Me, Hello, world '
			}).appendTo($_body),
			spy = sinon.spy(GA, 'factory'),
			factorySpy = sinon.spy(GA, 'processFactoryOptions');
		});

		test('link with custom event attached is found', function () {
			a.trigger('click');
			expect(spy.called).to.equal(true);
		});

		test('analytics type is correct', function () {
			// a.trigger('click');
			// expect(spy.calledWith('printPage')).to.equal(true);
			expect(GA.analyticsType).to.equal('printPage');
		});

		test('analytics additional parameters are found correctly', function () {
			a.trigger('click');
			expect(factorySpy.calledWith(['Print Me', ' Hello', ' world '])).to.equal(true);
		});

		test('whitespace between additional parameters is removed', function () {
			var returnValue = ['_trackEvent', 'Print', 'current page', 'Print Me', 'Hello', 'world'];
			a.trigger('click');
			expect(factorySpy.returned(returnValue)).to.equal(true);
		});

		teardown(function () {
			$('#customLink').remove();
			spy.restore();
			factorySpy.restore();
		});
	});
})();
