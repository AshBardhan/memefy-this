var clickedEl = null;

document.body.style.position="relative";

document.addEventListener("mousedown", function(event){
	//right click
	if(event.button == 2) {
		clickedEl = event.target;
	}
}, true);


var defaultPosition = 'center';
var defaultFontSize = 'medium';
var selectedTextType, selectedText;
var memeTextOptionSelected = false;

var memeTextOptions = {
	'top': {
		'size': defaultFontSize,
		'pos': defaultPosition,
		'defaultText': 'Top Text'
	},
	'bottom': {
		'size': defaultFontSize,
		'pos': defaultPosition,
		'defaultText': 'Bottom Text'
	}
};

function setMemeTextOptionsBoxPosition(memeTextOptionsBox) {
	memeTextOptionsBox.style.top = (selectedTextType === 'bottom' ? selectedText.offsetTop - memeTextOptionsBox.offsetHeight - 10: selectedText.offsetTop + selectedText.offsetHeight) + 'px';
}


function adjustHeight(el, minHeight) {
	// compute the height difference which is caused by border and outline
	var outerHeight = parseInt(window.getComputedStyle(el).height, 10);
	var diff = outerHeight - el.clientHeight;

	// set the height to 0 in case of it has to be shrinked
	el.style.height = 0;

	// set the correct height
	// el.scrollHeight is the full height of the content, not just the visible part
	el.style.height = Math.max(minHeight, el.scrollHeight + diff) + 'px';
}

function setMemeTextHeight(memeText) {
	// we adjust height to the initial content
	memeText.style.height = 0;
	memeText.minHeight = memeText.scrollHeight;
	adjustHeight(memeText, memeText.minHeight);
}

function showMemeTextOptionsBox(memeTextOptionsBox) {
	memeTextOptionsBox.style.display = 'block';
	memeTextOptionsBox.setAttribute('type', selectedTextType);
}

function hideMemeTextOptionsBox(memeTextOptionsBox) {
	memeTextOptionsBox.style.display = 'none';
}

function setMemeTextOptionsBox(optionType, memeTextOptionsBox) {
	var memeGroupOptions = memeTextOptionsBox.querySelectorAll('[data-' + optionType + ']');
	[].forEach.call(memeGroupOptions, function (memeGroupOption) {
		memeGroupOption.classList.remove('selected');
		if (memeGroupOption.getAttribute('data-' + optionType) === memeTextOptions[selectedTextType][optionType]) {
			memeGroupOption.classList.add('selected');
		}
	});
}

function setMemeBoxOption(memeTextOptionsBox) {
	['size', 'pos'].forEach(function (optionType) {
		setMemeTextOptionsBox(optionType, memeTextOptionsBox);
	});
}

function resetMemeTextOptions(memeText) {
	var textType = memeText.getAttribute('data-type');
	memeText.value = memeTextOptions[textType]['defaultText'];
	memeTextOptions[textType]['size'] = defaultFontSize;
	memeTextOptions[textType]['pos'] = defaultPosition;
	memeText.setAttribute('data-pos', memeTextOptions[textType]['pos']);
	memeText.setAttribute('data-size', memeTextOptions[textType]['size']);
}

function setMemeBoxContent(memeBox) {
	var memeTexts = memeBox.querySelectorAll('.js-memefy_meme-text');
	var memeTextOptionsBox = memeBox.querySelector('.js-memefy_meme-text-options');
	var memePosBtns = memeBox.querySelectorAll('.js-memefy_pos-btn');
	var memeSizeBtns = memeBox.querySelectorAll('.js-memefy_size-btn');
	var memeDownloadBtn = memeBox.querySelector('.js-memefy_download-meme');
	var memeCancelBtn = memeBox.querySelector('.js-memefy_cancel-meme');
	var memeRefreshBtn = memeBox.querySelector('.js-memefy_refresh-meme');
	var memeBoxOverlay = document.querySelector('.js-memefy_meme-box-overlay');

	[].forEach.call(memeTexts, function (memeText) {
		resetMemeTextOptions(memeText);
		setMemeTextHeight(memeText);

		memeText.addEventListener('input', function () {
			adjustHeight(this, this.minHeight);
			setMemeTextOptionsBoxPosition(memeTextOptionsBox);
		});

		memeText.addEventListener('focus', function () {
			var type = this.getAttribute('data-type');
			memeText.classList.add('selected');
			selectedTextType = type;
			selectedText = memeText;
			setMemeBoxOption(memeTextOptionsBox);
			showMemeTextOptionsBox(memeTextOptionsBox);
			setMemeTextOptionsBoxPosition(memeTextOptionsBox);
		});

		memeText.addEventListener('blur', function (e) {
			if(!memeTextOptionSelected) {
				memeText.classList.remove('selected');
				hideMemeTextOptionsBox(memeTextOptionsBox);
			}
		});
	});

	[].forEach.call(memePosBtns, function (memePosBtn) {
		memePosBtn.addEventListener('mousedown', function () {
			memeTextOptionSelected = true;
			var position = this.getAttribute('data-pos');
			console.log(position);
			selectedText.setAttribute('data-pos', position);
			memeTextOptions[selectedTextType]['pos'] = position;
			setMemeTextOptionsBox('pos', memeTextOptionsBox);
			setTimeout(function () {
				selectedText.focus();
			}, 0);
		});

		memePosBtn.addEventListener('mouseout', function (e) {
			memeTextOptionSelected = false;
		});
	});

	[].forEach.call(memeSizeBtns, function (memeSizeBtn) {
		memeSizeBtn.addEventListener('mousedown', function () {
			memeTextOptionSelected = true;
			var fontSize = this.getAttribute('data-size');
			console.log(fontSize);
			selectedText.setAttribute('data-size', fontSize);
			memeTextOptions[selectedTextType]['size'] = fontSize;
			setMemeTextOptionsBox('size', memeTextOptionsBox);
			setMemeTextHeight(selectedText);
			setMemeTextOptionsBoxPosition(memeTextOptionsBox);
			setTimeout(function () {
				selectedText.focus();
			}, 0);
		});

		memeSizeBtn.addEventListener('mouseout', function (e) {
			memeTextOptionSelected = false;
		});
	});

	memeCancelBtn.addEventListener('click', function () {
		memeBoxOverlay.parentNode.removeChild(memeBoxOverlay);
		memeBox.parentNode.removeChild(memeBox);
	});

	function saveScreenshot() {
		var fileName = [
			'memefy',
			d.getFullYear(),
			d.getMonth() + 1,
			d.getDate(),
			d.getHours(),
			d.getMinutes(),
			d.getSeconds()
		].join('-') +'.png';

		var filePath =
			'filesystem:chrome-extension://' +
			chrome.i18n.getMessage('@@extension_id') +
			'/temporary/' +
			fileName;

		chrome.downloads.download(
			{
				url: filePath
			},
			function() {
				// If there was an error, just open the screenshot in a tab.
				// This happens in incognito mode where extension cannot access filesystem.
				if (chrome.runtime.lastError) {
					window.open(filePath);
				}
			}
		);
	}

	function onImgLoad(image) {
		var c = document.createElement('canvas');
		var iframeBounds = memeBox.getBoundingClientRect();
		c.width = iframeBounds.width;
		c.height = iframeBounds.height;
		c.style.display = 'none';

		var imageWindowsRatio = {};
		imageWindowsRatio.x = image.width / window.innerWidth;
		imageWindowsRatio.y = image.height / window.innerHeight;

		var ctx = c.getContext('2d');
		ctx.drawImage(
			image,
			iframeBounds.left * imageWindowsRatio.x,
			iframeBounds.top * imageWindowsRatio.y,
			iframeBounds.width * imageWindowsRatio.x,
			iframeBounds.height * imageWindowsRatio.y,
			0,
			0,
			iframeBounds.width,
			iframeBounds.height
		);
		image.removeEventListener('load', onImgLoad);

		var d = new Date();
		var fileName = [
				'meme',
				d.getFullYear(),
				d.getMonth() + 1,
				d.getDate(),
				d.getHours(),
				d.getMinutes(),
				d.getSeconds()
			].join('-') + '.png';

		var link = document.createElement('a');
		link.href = c.toDataURL();
		link.download = fileName;
		document.body.appendChild(link);
		link.click();
		link.parentNode.removeChild(link);
	}

	memeDownloadBtn.addEventListener('click', function () {
		chrome.runtime.sendMessage({msg: 'download_meme'}, function (response) {
			console.log(response);
			if (response && response.imgSrc) {
				var image = new Image();
				image.src = response.imgSrc;
				image.addEventListener('load', function () {
					onImgLoad(image);
					console.log('making image');
				});
			}
		});
	});

	memeRefreshBtn.addEventListener('click', function () {
		[].forEach.call(memeTexts, function (memeText) {
			resetMemeTextOptions(memeText);
			setMemeTextHeight(memeText);
		});
	});
}

function makeMemeBox(){
	var bodyRect = document.body.getBoundingClientRect(),
		clickedElRect = clickedEl.getBoundingClientRect(),
		clickedElWidth = clickedEl.width,
		clickedElHeight = clickedEl.height,
		clickedElOffsetTop   = clickedElRect.top - bodyRect.top,
		clickedElOffsetLeft   = clickedElRect.left - bodyRect.left;

	var memeBox = document.createElement('div');
	memeBox.classList.add('js-memefy_meme-box','_memefy_meme-box');
	memeBox.style.width = clickedElWidth + 'px';
	memeBox.style.height = clickedElHeight + 'px';
	memeBox.style.backgroundImage = 'url("' + clickedEl.src + '")';
	/*memeBox.style.top = clickedElOffsetTop + 'px';
	memeBox.style.left = clickedElOffsetLeft + 'px';*/

	memeBox.innerHTML =
		'<textarea rows="1" spellcheck="false" title="Click here to change text" class="_memefy_meme-text js-memefy_meme-text" tabindex="-1" data-type="top"></textarea> ' +
		'<textarea rows="1" spellcheck="false" title="Click here to change text" class="_memefy_meme-text  js-memefy_meme-text" tabindex="-1" data-type="bottom"></textarea>' +
		'<div id="_memefy_meme-text-options" class="js-memefy_meme-text-options">' +
			'<div class="_memefy_btn js-memefy_pos-btn" data-pos="left">L</div>' +
			'<div class="_memefy_btn js-memefy_pos-btn" data-pos="center">C</div>' +
			'<div class="_memefy_btn js-memefy_pos-btn" data-pos="right">R</div>' +
			'<div class="_memefy_btn js-memefy_size-btn" data-size="xsmall">XS</div>' +
			'<div class="_memefy_btn js-memefy_size-btn" data-size="small">S</div>' +
			'<div class="_memefy_btn js-memefy_size-btn" data-size="medium">M</div>' +
			'<div class="_memefy_btn js-memefy_size-btn" data-size="large">L</div>' +
			'<div class="_memefy_btn js-memefy_size-btn" data-size="xlarge">XL</div>' +
		'</div>' +
		'<ul id="_memefy_meme-box-options">'+
			'<li class="js-memefy_cancel-meme cancel-meme">' +
				'<svg xmlns="http://www.w3.org/2000/svg" version="1.1" x="0px" y="0px" viewBox="0 0 47.971 47.971" style="enable-background:new 0 0 47.971 47.971;" xml:space="preserve" width="512px" height="512px">' +
					'<g id="icon-cancel">' +
						'<path d="M28.228,23.986L47.092,5.122c1.172-1.171,1.172-3.071,0-4.242c-1.172-1.172-3.07-1.172-4.242,0L23.986,19.744L5.121,0.88 c-1.172-1.172-3.07-1.172-4.242,0c-1.172,1.171-1.172,3.071,0,4.242l18.865,18.864L0.879,42.85c-1.172,1.171-1.172,3.071,0,4.242   C1.465,47.677,2.233,47.97,3,47.97s1.535-0.293,2.121-0.879l18.865-18.864L42.85,47.091c0.586,0.586,1.354,0.879,2.121,0.879   s1.535-0.293,2.121-0.879c1.172-1.171,1.172-3.071,0-4.242L28.228,23.986z"/>' +
					'</g>' +
				'</svg>' +
			'</li>' +
			'<li class="js-memefy_download-meme download-meme">' +
				'<svg xmlns="http://www.w3.org/2000/svg" version="1.1" x="0px" y="0px" width="512px" height="512px" viewBox="0 0 433.5 433.5" style="enable-background:new 0 0 433.5 433.5;" xml:space="preserve">' +
					'<g id="icon-download">' +
						'<path d="M395.25,153h-102V0h-153v153h-102l178.5,178.5L395.25,153z M38.25,382.5v51h357v-51H38.25z"/>' +
					'</g>' +
				'</svg>' +
			'</li>' +
			'<li class="js-memefy_refresh-meme refresh-meme">' +
				'<svg xmlns="http://www.w3.org/2000/svg" version="1.1" x="0px" y="0px" width="512px" height="512px" viewBox="0 0 408 408" style="enable-background:new 0 0 408 408;" xml:space="preserve">' +
					'<g id="icon-refresh">' +
						'<path d="M346.8,61.2C311.1,22.95,260.1,0,204,0C91.8,0,0,91.8,0,204s91.8,204,204,204c94.35,0,173.4-66.3,196.35-153H346.8 C326.4,313.65,270.3,357,204,357c-84.15,0-153-68.85-153-153c0-84.15,68.85-153,153-153c43.35,0,79.05,17.85,107.1,45.9    l-81.6,81.6H408V0L346.8,61.2z"/>' +
					'</g>' +
				'</svg>' +
			'</li>' +
		'</ul>';

	document.body.appendChild(memeBox);

	var memeBoxOverlay = document.createElement('div');
	memeBoxOverlay.classList.add('js-memefy_meme-box-overlay', '_memefy_meme-box-overlay');
	document.body.appendChild(memeBoxOverlay);

	setMemeBoxContent(memeBox);
}

chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
	if (request.text && (request.text == "make_meme")) {
		clickedEl.setAttribute('text','invaded');
		makeMemeBox();
		sendResponse({ele: clickedEl.innerHTML});
		return true;
	}
});