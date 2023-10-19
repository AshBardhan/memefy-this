// var _AnalyticsCode = 'UA-54569024-2';
// var _gaq = _gaq || [];
// _gaq.push(['_setAccount', _AnalyticsCode]);
// _gaq.push(['_trackPageview']);

// (function () {
// 	var ga = document.createElement('script');
// 	ga.type = 'text/javascript';
// 	ga.async = true;
// 	ga.src = 'https://ssl.google-analytics.com/ga.js';
// 	var s = document.getElementsByTagName('script')[0];
// 	s.parentNode.insertBefore(ga, s);
// })();

// function trackGAEvent(eventName, eventValue) {
// 	_gaq.push(['_trackEvent', eventName, eventValue]);
// }

chrome.contextMenus.create({
	id: "myContextMenu",
	title: "Memefy This Image",
	contexts: ["image"]
});


chrome.contextMenus.onClicked.addListener((info, tab) => {
	if (tab) {
		chrome.tabs.sendMessage(tab.id, {text: "make_meme"}, response => {
			//trackGAEvent('meme_menu-option', 'select');
			return true;
		});
	}
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
	if (request.msg) {
		if (request.msg === 'download_meme') {
			chrome.tabs.captureVisibleTab(
				null,
				{format: 'png', quality: 100},
				dataURL => sendResponse({imgSrc: dataURL})
			);
			return true;
		}

		if (request.msg === 'track_GA_event') {
			//trackGAEvent(request.eventName, request.eventValue);
		}
	}
});