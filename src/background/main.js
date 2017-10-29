/**
 * Add your Analytics tracking ID here.
 */
var _AnalyticsCode = 'UA-54569024-2';

/**
 * Below is a modified version of the Google Analytics asynchronous tracking
 * code snippet.  It has been modified to pull the HTTPS version of ga.js
 * instead of the default HTTP version.  It is recommended that you use this
 * snippet instead of the standard tracking snippet provided when setting up
 * a Google Analytics account.
 */
var _gaq = _gaq || [];
_gaq.push(['_setAccount', _AnalyticsCode]);
_gaq.push(['_trackPageview']);

(function () {
	var ga = document.createElement('script');
	ga.type = 'text/javascript';
	ga.async = true;
	ga.src = 'https://ssl.google-analytics.com/ga.js';
	var s = document.getElementsByTagName('script')[0];
	s.parentNode.insertBefore(ga, s);
})();

function trackGAEvent(eventName, eventValue) {
	_gaq.push(['_trackEvent', eventName, eventValue]);
}

chrome.contextMenus.create({
	id: "myContextMenu",
	title: "Memefy This Image",
	contexts: ["image"]
});

chrome.contextMenus.onClicked.addListener(function (info, tab) {
	if (tab) {
		chrome.tabs.sendMessage(tab.id, {text: "make_meme"}, function (response) {
			trackGAEvent('meme_menu-option', 'select');
			console.log(response);
		});
	}
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
	if (request.msg) {
		if (request.msg === 'download_meme') {
			chrome.tabs.captureVisibleTab(
				null,
				{format: 'png', quality: 100},
				function (dataURL) {
					sendResponse({imgSrc: dataURL});
				}
			);
			return true;
		}

		if (request.msg === 'track_GA_event') {
			trackGAEvent(request.eventName, request.eventValue);
		}
	}
});