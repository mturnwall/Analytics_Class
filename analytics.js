/*jshint onevar: true, sub: true, curly: true */
/*global _gaq: true, $: true*/

/**
 *  A javascript class that makes it real easy to add custom google analytics tracking to any web site.
 *  The goal of this class is to reduce the amount of custom javascript that needs to be written for custom google analytic tracking.
 *
 *  @author Michael Turnwall
 *
 *	@class  GA
 *
 *  @license Copyright (c) 2013 Michael Turnwall
 *  Released under the GPL v3 License
 *  <p>This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.</p>
 *  <p>This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.</p>
 *  <p>You should have received a copy of the GNU General Public License along with this program. If not, see <a href="http://www.gnu.org/licenses/gpl-3.0.html">&lt;http://www.gnu.org/licenses/gpl-3.0.html&gt;</a>.</p>
 */
var GA = (function() {
	var defaults = {
			domain: '',
			trackOutbound: true,
			siteSearchSelector: '',
			siteSearchInput: '',
			timer: 200
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
		'version': '0.4.2',	// added load feature
		/**
		 *  false means the analytics code is not ready (loaded)
		 *  @type {Boolean}
		 */
		ready: false,
		/**
		 *  this will hold a list of all the available providers with their associated setup() and tracking methods
		 *  @type {Object}
		 *  @example
		 *  // here's an example on how to create a new provider
		 *  availableProviders['Google'] = {
		 *    defaults: {
		 *      domain: ''
		 *    },
		 *    setup: function () {
		 *      // load ga.js
		 *    };
		 *  }
		 */
		availableProviders: {},
		
		/**
		 *  remove whitespace from the beginning and end of a string
		 *  @param   {String} value a string to remove whitespace from
		 *  @returns {String} the same string with whitespace removed
		 */
		cleanValue: function (value) {
			value = value.replace(/^(\s)*/, '');
			value = value.replace(/(\s)*$/, '');
			return value;
		},
		/**
		 *  Loop through the availableProviders matching the ones passed in by the user
		 *  If a match is found call the initalize function for that provided to set necessary
		 *  options and load the provider's scripts.
		 *  Right now only Google Analytics is supported
		 *  @param {Object} providers list of providers to enable as well as any options to set for the provider
		 */
		loadProviders: function (providers) {
			var key, provider, options;
			for (key in providers) {
				try	{
					provider = this.availableProviders[key];
					provider.setup(providers[key]);
				} catch(e) {
					throw new Error('Sorry, no provider with the name of "' + key + '" is available');
				}
			}
			// we are ready to do some tracking
			this.ready = true;
		},
		/**
		 *  extend an object by merging with other objects
		 *  if only one object is passed in then it extends the GA class
		 *  @return {Object} the merged objects
		 */
		extend: function () {
			var target = arguments[0] || {},
				i = 1,
				length = arguments.length,
				property,
				source;
			if (length === i) {
				target = this;
				i = 0;
			}
			for ( ; i < length; i++) {
				source = arguments[i];
				if (source !== null) {
					for (property in source) {
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
						// remove any whitespace at the beginning of the string
						params.push(this.cleanValue(gaOptions[i]) || '');
					}
				} else {
					params.push(gaOptions);
				}
			}
			return params;
		},
		factory: function (gaType, gaOptions) {
			var parameters = false,
				key, gaEvent;
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
		 *  @param   {Array} parameters an array of the parameters, ex. [['_trackEvent', 'Payment Calculator', 'submit']]
		 */
		pushTrackEvent: function (parameters) {
			var key;
			for (key in parameters) {
				_gaq.push(parameters[key]);
			}
		},
		/**
		 *  track outbound links, tracking fires after 200 ms to make sure it is recorded properly
		 *  @param   {DOM Node} el the link that was clicked on
		 */
		outboundLinks: function(el) {
			var link = el.href,
				exitType = (!link.match(/maps.google.com/ig)) ? 'exit' : 'Google Maps Driving Directions';
			GA.pushTrackEvent([
				['_trackEvent', 'Outbound Links', exitType, link]
			]);
			setTimeout(function() {
				location.href = link;
			}, this.opts.timer);
		},
		trackSiteSearch: function (form) {
			this.pushTrackEvent(this.factory('siteSearch', form[this.opts.siteSearchInput].value));
			return true;
		},
		/**
		 *  Setup tracking for forms. Any form control that has data-analytics-track-value="true"
		 *  on the tag will have it's value pushed to _gaq. Values are separated by a colon.
		 *  @param   {DOM Node} form the form that is going to be tracked
		 *  @returns {Boolean} true so that the form will still submit as normal
		 */
		trackForms: function (form) {
			var analyticsType = form.getAttribute('data-analytics-type') || false,
				analyticsInfo = '',
				controlType;
			if (analyticsType) {
				$('input, select', form).each(function () {
					controlType = this.getAttribute('type');
					if (this.getAttribute('data-analytics-track-value')) {
						if (controlType === 'text' || controlType === 'hidden') {
							analyticsInfo += ':' + this.value;
						} else if ((controlType === 'radio' || controlType === 'checkbox') && this.checked) {
							analyticsInfo += ':' + this.value;
						}
					}
				});
				this.pushTrackEvent(this.factory(analyticsType, analyticsInfo.substr(1)));
			}
			return true;
		},
		/**
		 *  Determines if a link is an outbound link or not. This method will pull the values from
		 *  data-analytics-type and data-analytics-info to contruct the Array that will get pushed to _gaq
		 *  @param   {DOM Node} el the link that had it's click event triggered
		 *  @returns {Boolean} if internal link return true so that the link is followed. Outbound links
		 *                        returns false to allow time for the _gaq.push() method to fire
		 */
		trackLinks: function (el) {
			var analyticsInfo,
				regexp = new RegExp('^http(s)?://([a-z]+\\.)?(' + this.opts.domain + ')', 'ig'),
				parameters = false;
			this.analyticsType = el.getAttribute('data-analytics-type') || false;
			if (this.analyticsType) {
				parameters = [];
				this.analyticsInfo = (el.getAttribute('data-analytics-info')) ? el.getAttribute('data-analytics-info').split(',') : '';
				parameters = (this.factory(this.analyticsType, this.analyticsInfo));
			} else if (!regexp.test(el.href)) {	// track outbound links
				this.outboundLinks(el);
				return false;
			}
			if (parameters) {
				this.pushTrackEvent(parameters);
				return true;
			}
		},
		/**
		 *  Setups the object's options and bind events to elements that need to be tracked
		 *  @param   {Object} userEvents key:value pairs of the custom events that need to be tracked
		 *  @param   {Object} options user defined options that override the default options
		 */
		init: function (userEvents, options) {
			var that = this;
			this.gaEvents = this.extend(gaEvents, userEvents);
			this.opts = this.extend(defaults, options);
			/*
				setup tracking for all links
				the default behavior is to prevent the link's default behavior
				so e.preventDefault() is placed at the end of the binding
				but sometimes we need to follow the link so those conditions return true
			*/
			$('body').on('click', 'a', function () {
				return that.trackLinks(this);
			});
			/*
				track all forms on the page
			 */
			if ($('form').not(this.opts.siteSearchSelector).length) {
				$('form').not(this.opts.siteSearchSelector).on('submit', function() {
					that.trackForms(this);
					return false; // for testing change this to false so the form doesn't actually submit
				});
			}
			if ($(this.opts.siteSearchSelector.length)) {
				$(this.opts.siteSearchSelector).submit(function () {
					return that.trackSiteSearch(this);
				});
			}
		}
	};
})();

/**
 *	Object for setting up Google Analytics
 *	@example
 *  GA.loadProviders({
 *    'Google': {
 *      'trackingId': 'UA-XXXXXX-X',
 *      'domain': 'example',
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