(function () {
	function ok(expr, msg) {
		if (!expr) throw new Error(msg);
	}
	suite('Outbound Links', function () {
		var a, spy;
		setup(function () {
			a = $('<a/>', {
				id: 'outboundLink',
				href: 'http://www.google.com',
				text: 'Outbound link'
			}).appendTo($_body),
			spy = sinon.spy(_gaq, 'push');
		});

		test('Outbound returns false', function () {
			link = $('#outboundLink');
			expect(GA.trackLinks(a[0])).to.be.false;
		});

		test('_gaq.push is triggered', function () {
			a.trigger('click');
			assert(spy.called, '_gaq was not called');
		});

		test('parameters pushed are correct', function () {
			var exitType = 'exit',
				link = 'http://www.google.com/';
			a.trigger('click');
			expect(spy.calledWith(['_trackEvent', 'Outbound Links', exitType, link])).to.be.ok;
		});

		test('internal link is not tracked as outbound', function () {
			var internalLink = $('<a/>', {
					id: 'internalLink',
					href: 'http://example.com',
					text: 'Outbound link'
				}).appendTo($_body),
				exitType = 'exit',
					link = 'http://www.example.com/';
			internalLink.trigger('click');
			assert.equal(spy.called, false, 'an internal link is being tracked as an outbound link');

			internalLink.remove();
		});

		teardown(function () {
			$('#outboundLink').remove();
			spy.restore();
		});
	});

	suite('Custom Events', function () {
		var a, spy;
		setup(function () {
			a = $('<a/>', {
				id: 'customLink',
				href: 'http://www.example.com',
				text: 'Custom Event Link',
				'data-analytics-type': 'printPage',
				'data-analytics-info': 'Print Me'
			}).appendTo($_body),
			spy = sinon.spy(GA, 'factory');
		});

		test('link with custom event attached is found', function () {
			a.trigger('click');
			expect(spy.called).to.be.true;
		});
		teardown(function () {
			$('#customLink').remove();
			spy.restore();
		});
	});
})();
