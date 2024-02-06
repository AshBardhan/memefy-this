import Analytics from './utils/google-analytics.js';

// Creates a context menu option that allows your generate meme from the selected image
chrome.contextMenus.create({
	id: "myContextMenu",
	title: "Memefy This Image",
	contexts: ["image"]
});

// Event listener once the context menu option is selected
chrome.contextMenus.onClicked.addListener((info, tab) => {
	if (tab) {
		chrome.tabs.sendMessage(tab.id, {text: "make_meme"}, response => {
			Analytics.fireEvent('meme_menu-option', {value: 'select'});
			return true;
		});
	}
});

// Event listener that is sent from 'content_scripts' to download the generated meme or track GA event
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
	if (request?.msg) {
		if (request.msg === 'download_meme') {
			chrome.tabs.captureVisibleTab(null, {format: 'png', quality: 100}, dataURL => sendResponse({imgSrc: dataURL}));
			return true;
		}

		if (request.msg === 'track_GA_event') {
			Analytics.fireEvent(request.eventName, {value: request.eventValue});
		}
	}
});