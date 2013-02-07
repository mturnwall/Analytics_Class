var customEvents = {
	'requestInfo': ['_trackEvent', 'Request More Information', 'link'],
	'siteSearch': ['_trackEvent', 'Quick Search', 'main search'],
	'printPage': ['_trackEvent', 'Print', 'current page'],
	'testLink': ['_trackEvent', 'Testing Links', 'link'],
	'testSocial': [['_trackSocial'], ['_trackEvent',  'Test Social']]
};
/*
	Testing that links with custom tracking events are tracked correctly
 */
(function () {

	suite('Test Links', function () {
		var a, spy, factorySpy, gaqSpy;
		setup(function () {
			a = $('<a/>', {
				id: 'customLink',
				href: 'http://www.example.com',
				text: 'Custom Event Link',
				'data-analytics-type': 'printPage',
				'data-analytics-info': 'Print Me, Hello, world '
			}).appendTo($_body),
			spy = sinon.spy(GA, 'factory'),
			factorySpy = sinon.spy(GA, 'processFactoryOptions'),
			gaqSpy = sinon.spy(_gaq, 'push');
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
			// expect(factorySpy.returned(returnValue)).to.equal(true);
			assert.equal(factorySpy.returned(returnValue), true, factorySpy.args + ' shouldn\'t contain spaces at the beginning and end of the string');
		});

		test('trackLinks returns "true" so that links are followed', function () {
			var trackLinksSpy = sinon.spy(GA, 'trackLinks');
			a.trigger('click');
			expect(trackLinksSpy.returned(true)).to.equal(true);
			trackLinksSpy = null;
		});

		test('parameters pushed to the _gaq object correctly', function () {
			var parameters = ['_trackEvent', 'Print', 'current page', 'Print Me', 'Hello', 'world'];
			a.trigger('click');
			expect(gaqSpy.calledWith(parameters)).to.equal(true);
		});

		test('Link that calls _gaq twice', function (done) {
			var socialLink = $('<a/>', {
				id: 'socialLink',
				href: 'http://www.example.com',
				text: 'Custom Event Link',
				'data-analytics-type': 'testSocial',
				'data-analytics-info': 'twitter, tweet '
			}).appendTo($_body);
			$('#socialLink').trigger('click');
			assert.equal(gaqSpy.calledTwice, true, 'looks like _gaq.push was not called twice - ' + gaqSpy.args);
			socialLink.remove();
			done();
		});

		test('multiple calls to _gaq.push are formatted correctly', function (done) {
			var socialLink = $('<a/>', {
					id: 'socialLink',
					href: 'http://www.example.com',
					text: 'Custom Event Link',
					'data-analytics-type': 'testSocial',
					'data-analytics-info': 'twitter, tweet '
				}).appendTo($_body),
				spyCall,
				i = 0,
				z,
				parameters;
			socialLink.trigger('click');
			for (z=gaqSpy.callCount; i<z; i+=1) {
				spyCall = gaqSpy.getCall(i);
				parameters = customEvents.testSocial[i];
				parameters.push('twitter', 'tweet');
				assert.equal(spyCall.calledWith(parameters), true, '');
			}
			socialLink.remove();
			done();
		});

		teardown(function () {
			$('#customLink').remove();
			spy.restore();
			factorySpy.restore();
			gaqSpy.restore();
		});
	});
})();
