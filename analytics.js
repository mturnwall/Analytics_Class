/**
 *  @preserve Copyright (c) 2013 Michael Turnwall
 *  Released under the GPL v3 License
 *  <p>This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.</p>
 *  <p>This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.</p>
 *  <p>You should have received a copy of the GNU General Public License along with this program. If not, see <a href="http://www.gnu.org/licenses/gpl-3.0.html">&lt;http://www.gnu.org/licenses/gpl-3.0.html&gt;</a>.</p>
 */
GA = (function() {
	var defaults = {
			domain: '',
			trackOutbound: true,
			siteSearchSelector: '#searchForm',
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
		'version': '0.3.2',
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
				_gaq.push(parameters[key]);
			}
		},
		/**
		 *  track outbound links, tracking fires after 200 ms to make sure it is recorded properly
		 *  @param   {DOM Node} el the link that was clicked on
		 */
		outboundLinks: function(el) {
			var link = el.href,
				exitType = (!href.match(/maps.google.com/ig)) ? 'exit' : 'Google Maps Driving Directions';
			GA.pushTrackEvent([
				['_trackEvent', 'Outbound Links', exitType, link]
			]);
			setTimeout(function() {
				location.href = link;
			}, 200);
		},
		trackSiteSearch: function (form) {
			this.pushTrackEvent(this.factory('siteSearch', form[opts.siteSearchInput].value));
			return true;
		},
		trackForms: function (form) {
			var analyticsType = form.getAttribute('data-analytics-type') || false,
				analyticsInfo = '',
				numOfFields = form.elements.length,
				controlType,
				i;
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
		trackLinks: function (el) {
			var analyticsInfo,
				analyticsType = el.getAttribute('data-analytics-type') || false,
				regexp = new RegExp('^http(s)?:\/\/([a-z]+\.)?(' + this.opts.domain + ')', 'ig'),
				parameters = false;
			if (analyticsType) {
				parameters = [];
				analyticsInfo = (el.getAttribute('data-analytics-info')) ? el.getAttribute('data-analytics-info').split(',') : '';
				parameters = (this.factory(analyticsType, analyticsInfo));
			} else if (!el.href.match(regexp)) {	// track outbound links
				this.outboundLinks(el);
				return false;
			}
			if (parameters) {
				this.pushTrackEvent(parameters);
				return true;
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
			$('body').on('click', 'a', function (e) {
				return that.trackLinks(this);
			});
			/*
				track all forms on the page
			 */
			$('form').on('submit', function() {
				that.trackForms(this);
				return false; // for testing change this to false so the form doesn't actually submit
			});
			$(this.opts.siteSearchSelector).submit(function () {
				return that.trackSiteSearch(this);
			});
		}
	};
})();