var customEvents = {
	'requestInfo': ['_trackEvent', 'Request More Information', 'link'],
	'getInfo': ['_trackEvent', 'Get More Info', 'submit'],
	'siteSearch': ['_trackEvent', 'Quick Search', 'main search'],
	'printPage': ['_trackEvent', 'Print', 'current page'],
	'emailSignup': ['_trackEvent', 'Email', 'signup'],
	'zipcodeSearch': ['_trackEvent', 'Store Search', 'zipcode search'],
	'stateSearch': ['_trackEvent', 'Store Search', 'state search'],
	'contactForm': ['_trackEvent', 'Contact', 'submit'],
	'carouselView': ['_trackEvent', 'Carousel', 'rotator views'],
	'carouselArrow': ['_trackEvent', 'Carousel', 'rotator clicks'],
	'eventFilterSearch': ['_trackEvent', 'Event Listing', 'event details filter'],
	'eventRegister': ['_trackEvent', 'Event Listing', 'register'],
	'videoState': ['_trackEvent', 'Video'],
	'social': [['_trackSocial'], ['_trackEvent',  'Social share']]
};
/*
	Testing that links with custom tracking events are tracked correctly
 */
(function () {
	var key;
	for (key in customEvents) {
		console.log('a ', key);
	
		suite('Custom Events', function () {
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

			// for (key in customEvents) {
				test('testing ' + key + ' custom event', function () {
					var customLink = $('<a/>', {
						id: 'customEventLink',
						href: 'http://www.example.com',
						text: 'Custom Event Link',
						'data-analytics-type': key
					}).appendTo($_body);
					customLink.trigger('click');
					console.log(key);
					expect(gaqSpy.calledWith([customEvents[key]])).to.equal(true);
					customLink.remove();
				});
			// }

			teardown(function () {
				$('#customLink').remove();
				spy.restore();
				factorySpy.restore();
				gaqSpy.restore();
			});
		});
	}
})();
