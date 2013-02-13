/**
 *	Object for setting up Google Analytics
 *	@example
 *  GA.loadProviders({
 *    'Google': {
 *      'trackingId': 'UA-XXXXXX-X',
 *      'domain': 'marinemax',
 *      'debug': true
 *    }
 *  });
 *  
 *  // You can also just simply pass the tracking ID
 *  GA.loadProviders({
 *    'Google': 'UA-XXXXXX-X'
 *  })
 *
 */
GA.availableProviders['Google'] = {
	defaults: {
		domain: '',
		debug: false,
		enhancedLink: false,
		trackingId: ''
	},
	setup: function (opts) {
		var googleScript,
			option,
			_gaq = window._gaq = window._gaq || []; // _gaq is attached to window so scope is beyond this function
		options = (typeof opts !== 'string') ? GA.extend({}, this.defaults, opts) : GA.extend({}, this.defaults, { trackingId: opts});
		scriptName = (!options.debug) ? 'ga.js' : 'u/ga_debug.js';
		if (options.enhancedLink) {
			_gaq.push(['_require', 'inpage_linkid', '//www.google-analytics.com/plugins/ga/inpage_linkid.js']);
		}
		if (options.trackingId) {
			_gaq.push(['_setAccount', options.trackingId]);
		} else {
			throw new Error('You need to provide a tracking ID for Google Analytics');
		}
		if (options.domain) {
			_gaq.push(['_setDomainName', options.domain]);
		}
		_gaq.push(['_trackPageview']);
		(function() {
			var ga, s;
			ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
			ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/' + scriptName;
			s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
		})();
	}
};