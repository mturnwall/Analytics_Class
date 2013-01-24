Analytics Class
===================

<a href="http://projects.turnwall.net/Analytics_Class/">Project Page</a> -- <a href="http://projects.turnwall.net/Analytics_Class/demo">Demo Page</a>

Description
-------------
This is a javascript class that makes it real easy to add custom google analytics tracking to any web site. The goal of this class is to reduce the amount of custom javascript that needs to be written for custom google analytic tracking.

Usage
--------

Include [jQuery](http://jquery.com) and the analytics.js file on your page. Don't forget to include the [default tracking code](https://support.google.com/analytics/bin/answer.py?hl=en&answer=1008080) from Google. If you want to see if your events are tracking correctly  replace all references to /ga.js with /u/ga_debug.js. You'll now see a bunch of analytics output in your browser's console.

```js
<script src="//ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js"></script>
<script type="text/javascript" src="/path/to/analytics.js"></script>
<script type="text/javascript">
	var _gaq = _gaq || [];
	_gaq.push(['_setAccount', 'UA-XXXXX-Y']);
	_gaq.push(['_trackPageview']);

	(function() {
		var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
		ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
		var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
	})();
</script>
```


### Setup Custom Tracking

For each custom tracking event you need to add a new property into the `gaEvents` object. Then you need to add two data attributes to your element, `data-analytics-type` and `data-analytics-info`. The attribute `data-analytics-type` refers to the property you added to `gaEvents`.

#### Example

Here is an example of tracking a link to request more information.

```js
gaEvents = {
	'requestInfo': ['_trackEvent', 'Request More Information', 'link']
};
```

Add the data attributes to the HTML element
```html
<a class="printPage" href="#" data-analytics-typ="requestInfo" data-analytics-info="Additional Information">Request More Information</a>
```

When those pieces are in place here is the information that will get pushed to the `_gaq` object:

`['_trackEvent', 'Request More Information', 'link', 'Additional Information']`

### Outbound Links

All outbound links are tracked automatically. If you wish to disable tracking of outbound links, make the `trackOutbound` option "false".

Copyright and License
----------------------

Copyright (c) 2013 Michael Turnwall

This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along with this program. If not, see <http://www.gnu.org/licenses/>.
