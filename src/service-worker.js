import Analytics from './utils/google-analytics.js';

chrome.contextMenus.create({
	id: "myContextMenu",
	title: "Memefy This Image",
	contexts: ["image"]
});


chrome.contextMenus.onClicked.addListener((info, tab) => {
	if (tab) {
		chrome.tabs.sendMessage(tab.id, {text: "make_meme"}, response => {
			Analytics.fireEvent('meme_menu-option', {value: 'select'});
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
			Analytics.fireEvent(request.eventName, {value: request.eventValue});
		}
	}
});