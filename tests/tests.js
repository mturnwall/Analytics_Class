(function () {
	function ok(expr, msg) {
		if (!expr) throw new Error(msg);
	}
	
	suite('Test Utilities', function () {
		test('Remove whitespace from beginning of string', function () {
			var cleanValue = GA.cleanValue('   hello world');
			assert.equal(cleanValue, 'hello world', 'whitespace wasn\'t removed from the beginning of the string');
		});
		test('Remove whitespace from end of string', function () {
			var cleanValue = GA.cleanValue('hello world   ');
			assert.equal(cleanValue, 'hello world', 'whitespace wasn\'t removed from the end of the string');
		});
		test('Remove whitespace from beginning and  end of string', function () {
			var cleanValue = GA.cleanValue(' hello ');
			assert.equal(cleanValue, 'hello', 'whitespace wasn\'t removed');
		});
	});

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
			expect(spy.calledWithExactly(['_trackEvent', 'Outbound Links', exitType, link])).to.be.true;
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
