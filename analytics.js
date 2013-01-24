GA = (function() {
	var defaults = {
			domain: '',
			trackOutbound: true,
			siteSearchInput: 'q'
		},
		/**
		 *	Add your custom tracking properties here or
		 *	pass in as an option when calling the init method
		 *	@example
		 *	'requestInfo': ['_trackEvent', 'Request More Information', 'link']
		 */
		gaEvents = {
			'requestInfo': ['_trackEvent', 'Request More Information', 'link'],
			'siteSearch': ['_trackEvent', 'Quick Search', 'main search'],
			'printPage': ['_trackEvent', 'Print', 'current page'],
			'social': [['_trackSocial'], ['_trackEvent',  'Social share']]
		};
	return {
		'version': '0.3',
		/**
		 *  extend an object by merging with other objects
		 *  if only one object is passed in then it extends the GA class
		 *  @return {Object} the merged objects
		 */
		mergeObj: function () {
			var target = arguments[0] || {},
				i = 1,
				length = arguments.length,
				source;
			if (length === i) {
				target = this;
				i = 0;
			}
			for ( ; i < length; i++) {
				source = arguments[i];
				if (source !== null) {
					for (var property in source) {
						target[property] = source[property];
					}
				}
			}
			return target;
		},
		processFactoryOptions: function (gaOptions, parameters) {
			var i, z, params = parameters;
			if (gaOptions) {
				if (typeof gaOptions !== 'string') {
					for (i=0, z=gaOptions.length; i<z; i++) {
						params.push(gaOptions[i] || '');
					}
				} else {
					params.push(gaOptions);
				}
			}
			return params;
		},
		factory: function (gaType, gaOptions) {
			var parameters = false,
				key, i, z, gaEvent;
			if (this.gaEvents[gaType]) {
				parameters = [];
				for (key in this.gaEvents[gaType]) {
					// shallow clone of object so we don't modify original object
					gaEvent = JSON.parse(JSON.stringify(this.gaEvents[gaType]));
					// if the first array item is a string then we don't have a two-dimensional array
					if (typeof this.gaEvents[gaType][key] === 'string') {
						parameters.push(this.processFactoryOptions(gaOptions, gaEvent));
						break;
					} else {
						parameters.push(this.processFactoryOptions(gaOptions, gaEvent[key]));
					}
				}
			}
			return parameters;
		},
		/**
		 *  push information to the tracking object
		 *  @param   {Array} parameters an array of the parameters, ex. ['_trackEvent', 'Payment Calculator', 'submit']
		 */
		pushTrackEvent: function (parameters) {
			var key, pageOutput;
			for (key in parameters) {
				document.write('parameters to push =' + parameters[key]);
				_gaq.push(parameters[key]);
			}
		},
		/**
		 *  track outbound links, tracking fires after 200 ms to make sure it is recorded properly
		 *  @param   {DOM Node} el the link that was clicked on
		 */
		outboundLinks: function (el) {
			var href = el.href,
				exitType = (!href.match(/maps.google.com/ig)) ? 'exit' : 'Google Maps Driving Directions';
			setTimeout(function() {
				_gaq.push(['_trackEvent', 'Outbound Links', 'exit', href]);
				location.href = href;
			}, 200);
		},
		trackSiteSearch: function (form) {
			this.pushTrackEvent(this.factory('siteSearch', form[opts.siteSearchInput].value));
			return true;
		},
		trackLinks: function (el) {
			var analyticsInfo,
				analyticsType = el.getAttribute('data-analytics-type') || false,
				regexp = new RegExp('^http(s)?:\/\/([a-z]+\.)?(' + this.opts.domain + ')', 'ig'),
				parameters = false;
			if (!el.href.match(regexp) && this.opts.trackOutbound) {	// track outbound links
				this.outboundLinks(el);
				return false;
			} else if (analyticsType) {
				parameters = [];
				analyticsInfo = (el.getAttribute('data-analytics-info')) ? el.getAttribute('data-analytics-info').split(',') : '';
				parameters = (this.factory(analyticsType, analyticsInfo));
			}
			if (parameters) {
				this.pushTrackEvent(parameters);
				return false;
			}
		},
		init: function (userEvents, options) {
			var that = this;
			this.opts = this.mergeObj(defaults, options);
			this.gaEvents = this.mergeObj(gaEvents, userEvents);
			/*
				setup tracking for all links
				the default behavior is to prevent the link's default behavior
				so e.preventDefault() is placed at the end of the binding
				but sometimes we need to follow the link so those conditions return true
			*/
			// _gaq.push(['_setDomainName', 'none']);
			$('body').on('click', 'a', function (e) {
				return that.trackLinks(this);
			});
			$('#searchForm').submit(function () {
				return that.trackSiteSearch(this);
			});
		}
	};
})();