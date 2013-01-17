GA = (function() {
	var opts = {
			domain: 'marinemax',
			siteSearchInput: 'q'
		},
		gaEvents = {
			requestInfo: ['_trackEvent', 'Request More Information', 'link'],
			siteSearch: ['_trackEvent', 'Quick Search', 'main search'],
			printPage: ['_trackEvent', 'Print', 'current page']
		};
	return {
		factory: function(type, option) {
			var parameters = false;
			if (gaEvents[type]) {
				parameters = gaEvents[type];
				if (option) {
					parameters.push(option);
				}
			}
			return parameters;
		},
		/**
		 *  push information to the tracking object
		 *  @param   {Array} parameters an array of the parameters, ex. ['_trackEvent', 'Payment Calculator', 'submit']
		 */
		pushTrackEvent: function(parameters) {
			debug.log(parameters);
			_gaq.push(parameters);
		},
		/**
		 *  track outbound links, tracking fires after 200 ms
		 *  @param   {DOM Node} el the link that was clicked on
		 */
		outboundLinks: function(el) {
			var href = el.href,
				exitType = (!href.match(/maps.google.com/ig)) ? 'exit' : 'Google Maps Driving Directions';
			setTimeout(function() {
				_gaq.push(['_trackEvent', 'Outbound Links', 'exit', href]);
				location.href = href;
			}, 200);
		},
		trackSiteSearch: function(form) {
			this.pushTrackEvent(this.factory('siteSearch', form[opts.siteSearchInput].value));
			return false;
		},
		trackLinks: function(el) {
			var analyticsType = el.getAttribute('data-analytics-type') || false,
				regexp = new RegExp('^http(s)?:\/\/([a-z]+\.)?(' + opts.domain + ')', 'ig'),
				parameters = false;
			if (!el.href.match(regexp)) {	// track outbound links
				this.outboundLinks(el);
				return false;
			} else if (analyticsType) {
				parameters = this.factory(analyticsType, el.getAttribute('data-analytics-info'));
				debug.log(parameters);
			}
			if (parameters) {
				this.pushTrackEvent(parameters);
				return true;
			}
		},
		init: function() {
			var that = this;
			/*
				setup tracking for all links
				the default behavior is to prevent the link's default behavior
				so e.preventDefault() is placed at the end of the binding
				but sometimes we need to follow the link so those conditions return true
			*/
			$('body').on('click', 'a', function(e) {
				return that.trackLinks(this);
			});
			$('#searchForm').submit(function() {
				return that.trackSiteSearch(this);
			});
		}
	};
})();