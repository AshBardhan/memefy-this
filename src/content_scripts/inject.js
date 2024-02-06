let memeTextOptionSelected = false;
let memeTextOptions = {
	'top': {
		'size': defaultFontSize,
		'pos': defaultPosition,
		'defaultText': defaultTopText
	},
	'bottom': {
		'size': defaultFontSize,
		'pos': defaultPosition,
		'defaultText': defaultBottomText
	}
};

let clickedEl = selectedTextType = selectedText = null;
let memeBox = memeBoxOverlay = memeTextOptionsBox = memeTexts = memePosBtns = memeSizeBtns = null;
let memeDownloadBtn = memeRefreshBtn = memeCancelBtn = null;
let warningBox = warningBoxTimer = null;

function setMemeTextOptionsBoxPosition() {
	memeTextOptionsBox.style.top = (selectedTextType === 'bottom' ? selectedText.offsetTop - memeTextOptionsBox.offsetHeight - 20 : selectedText.offsetTop + selectedText.offsetHeight) + 'px';
};

function adjustHeight(el, minHeight) {
	// compute the height difference which is caused by border and outline
	const outerHeight = parseInt(window.getComputedStyle(el).height, 10);
	const diff = outerHeight - el.clientHeight;

	// set the height to 0 in case of it has to be shrinked
	el.style.height = 0;

	// set the correct height
	// el.scrollHeight is the full height of the content, not just the visible part
	el.style.height = Math.max(minHeight, el.scrollHeight + diff) + 'px';
};

function setMemeTextHeight(memeText) {
	// we adjust height to the initial content
	memeText.style.height = 0;
	memeText.minHeight = memeText.scrollHeight;
	adjustHeight(memeText, memeText.minHeight);
};

function showMemeTextOptionsBox() {
	memeTextOptionsBox.style.opacity = 1;
	memeTextOptionsBox.style.visibility = 'visible';
	memeTextOptionsBox.setAttribute('type', selectedTextType);
};

function hideMemeTextOptionsBox() {
	memeTextOptionsBox.style.opacity = 0;
	memeTextOptionsBox.style.visibility = 'hidden';
};

function trackGAEvent(eventName, eventValue) {
	chrome.runtime.sendMessage({
		msg: 'track_GA_event',
		eventName: eventName,
		eventValue: eventValue
	});
};

function setMemeTextOptionsBox(optionType) {
	const memeGroupOptions = memeTextOptionsBox.querySelectorAll(`[data-${optionType}]`);
	Array.from(memeGroupOptions).forEach(memeGroupOption => {
		memeGroupOption.classList.remove('selected');
		if (memeGroupOption.getAttribute(`data-${optionType}`) === memeTextOptions[selectedTextType][optionType]) {
			memeGroupOption.classList.add('selected');
		}
	});
};

function setMemeBoxOption() {
	['size', 'pos'].forEach(optionType => setMemeTextOptionsBox(optionType));
};

function resetMemeTextOptions(memeText) {
	const textType = memeText.getAttribute('data-type');
	memeText.value = memeTextOptions[textType]['defaultText'];
	memeTextOptions[textType]['size'] = defaultFontSize;
	memeTextOptions[textType]['pos'] = defaultPosition;
	memeText.setAttribute('data-pos', memeTextOptions[textType]['pos']);
	memeText.setAttribute('data-size', memeTextOptions[textType]['size']);
};

function setMemeBoxContent() {
	memeTexts = memeBox.querySelectorAll('.js-memefy_meme-text');
	memeTextOptionsBox = memeBox.querySelector('.js-memefy_meme-text-options');
	memePosBtns = memeBox.querySelectorAll('.js-memefy_pos-btn');
	memeSizeBtns = memeBox.querySelectorAll('.js-memefy_size-btn');
	memeDownloadBtn = memeBox.querySelector('.js-memefy_download-meme');
	memeCancelBtn = memeBox.querySelector('.js-memefy_cancel-meme');
	memeRefreshBtn = memeBox.querySelector('.js-memefy_refresh-meme');

	Array.from(memeTexts).forEach(memeText => {
		resetMemeTextOptions(memeText);
		setMemeTextHeight(memeText);

		memeText.addEventListener('input', function () {
			adjustHeight(this, this.minHeight);
			setMemeTextOptionsBoxPosition();
		});

		memeText.addEventListener('focus', function () {
			const type = this.getAttribute('data-type');
			this.classList.add('selected');
			selectedTextType = type;
			selectedText = memeText;
			setMemeBoxOption();
			showMemeTextOptionsBox();
			setMemeTextOptionsBoxPosition();
			trackGAEvent('meme_text-focus', selectedTextType);
		});

		memeText.addEventListener('blur', function () {
			if (!memeTextOptionSelected) {
				this.classList.remove('selected');
				hideMemeTextOptionsBox();
				trackGAEvent('meme_text-blur', selectedTextType);
			}
		});
	});
	
	Array.from(memePosBtns).forEach(memePosBtn => {
		memePosBtn.addEventListener('mousedown', function () {
			const position = this.getAttribute('data-pos');
			memeTextOptionSelected = true;
			selectedText.setAttribute('data-pos', position);
			memeTextOptions[selectedTextType]['pos'] = position;
			setMemeTextOptionsBox('pos');
			setTimeout(() => selectedText.focus(), 0);
			trackGAEvent('meme_text-position', `${selectedTextType}-${position}`);
		});

		memePosBtn.addEventListener('mouseout', () => {
			memeTextOptionSelected = false;
		});
	});

	Array.from(memeSizeBtns).forEach(memeSizeBtn => {
		memeSizeBtn.addEventListener('mousedown', function () {
			const fontSize = this.getAttribute('data-size');
			memeTextOptionSelected = true;
			selectedText.setAttribute('data-size', fontSize);
			memeTextOptions[selectedTextType]['size'] = fontSize;
			setMemeTextOptionsBox('size');
			setMemeTextHeight(selectedText);
			setMemeTextOptionsBoxPosition();
			setTimeout(() => selectedText.focus(), 0);
			trackGAEvent('meme_text-size', `${selectedTextType}-${fontSize}`);
		});

		memeSizeBtn.addEventListener('mouseout', () => {
			memeTextOptionSelected = false;
		});
	});

	memeCancelBtn.addEventListener('click', () => {
		memeBoxOverlay.parentNode.removeChild(memeBoxOverlay);
		memeBox.parentNode.removeChild(memeBox);
		document.body.classList.remove('_memefy_body');
		trackGAEvent('meme_cancel', 'click');
	});

	function onImgLoad(image) {
		let c = document.createElement('canvas');
		const iframeBounds = memeBox.getBoundingClientRect();
		c.width = iframeBounds.width;
		c.height = iframeBounds.height;
		c.style.display = 'none';

		const devicePixelRatio = window.devicePixelRatio || 1;

		let ctx = c.getContext('2d');
		ctx.drawImage(
			image,
			iframeBounds.left * devicePixelRatio,
			iframeBounds.top * devicePixelRatio,
			iframeBounds.width * devicePixelRatio,
			iframeBounds.height * devicePixelRatio,
			0,
			0,
			iframeBounds.width,
			iframeBounds.height
		);
		image.removeEventListener('load', onImgLoad);

		const d = new Date();
		const fileName = [
			'memefy',
			d.getFullYear(),
			d.getMonth() + 1,
			d.getDate(),
			d.getHours(),
			d.getMinutes(),
			d.getSeconds()
		].join('-') + '.png';

		let link = document.createElement('a');
		link.href = c.toDataURL();
		link.download = fileName;
		document.body.appendChild(link);
		link.addEventListener('click', e => e.stopPropagation());
		link.click();
		link.parentNode.removeChild(link);
	}

	memeDownloadBtn.addEventListener('click', () => {
		setTimeout(() => {
			chrome.runtime.sendMessage({msg: 'download_meme'}, response => {
				if (response && response.imgSrc) {
					let image = new Image();
					image.src = response.imgSrc;
					image.addEventListener('load', () => onImgLoad(image));
					trackGAEvent('meme_download', 'click');
				}
			});
		}, 0);
	});

	memeRefreshBtn.addEventListener('click', () => {
		Array.from(memeTexts).forEach(memeText => {
			resetMemeTextOptions(memeText);
			setMemeTextHeight(memeText);
		});
		trackGAEvent('meme_refresh', 'click');
	});
};

function hideWarningBox() {
	warningBox.style.opacity = 0;
	warningBox.style.visibility = 'hidden';
};

function showWarningBox() {
	if (!warningBox) {
		warningBox = document.createElement('div');
		warningBox.classList.add('js-memefy_warning-box', '_memefy_warning-box');
		warningBox.innerHTML = warningBoxTemplate;
		document.body.appendChild(warningBox);

		warningBox.querySelector('.js-memefy_close-warning-box').addEventListener('click', () => {
			clearTimeout(warningBoxTimer);
			hideWarningBox();
			trackGAEvent('warning_box', 'close');
		});
	}

	warningBox.style.opacity = 1;
	warningBox.style.visibility = 'visible';
	clearTimeout(warningBoxTimer);
	warningBoxTimer = setTimeout(() => {
		hideWarningBox();
		trackGAEvent('warning_box', 'auto-close');
	}, warningBoxExpiry);
	trackGAEvent('warning_box', 'show');
	trackGAEvent('warning_meme_width', `${clickedEl.width}px`);
	trackGAEvent('warning_meme_height', `${clickedEl.height}px`);
};

function setMemeBox() {
	let clickedElWidth = clickedEl.width,
		clickedElHeight = clickedEl.height,
		windowWidth = window.innerWidth,
		windowHeight = window.innerHeight,
		memeBoxWidth = clickedElWidth,
		memeBoxHeight = clickedElHeight;

	memeBox = document.createElement('div');
	memeBox.classList.add('js-memefy_meme-box', '_memefy_meme-box');

	if (memeBoxWidth >= windowWidth) {
		memeBoxWidth = windowWidth - 30;
		memeBoxHeight = clickedElHeight / clickedElWidth * memeBoxWidth;
	}

	if (memeBoxHeight >= windowHeight) {
		memeBoxHeight = windowHeight - 10;
		memeBoxWidth = clickedElWidth / clickedElHeight * memeBoxHeight;
	}

	memeBox.style.width = `${memeBoxWidth}px`;
	memeBox.style.height = `${memeBoxHeight}px`;

	memeBox.style.backgroundImage = `url("${clickedEl.src}")`;
	memeBox.innerHTML= memeBoxTemplate;
	document.body.appendChild(memeBox);

	memeBoxOverlay = document.createElement('div');
	memeBoxOverlay.classList.add('js-memefy_meme-box-overlay', '_memefy_meme-box-overlay');
	document.body.appendChild(memeBoxOverlay);
	document.body.classList.add('_memefy_body');
	trackGAEvent('meme_box', 'show');
	trackGAEvent('meme_width', `${memeBoxWidth}px`);
	trackGAEvent('meme_height', `${memeBoxHeight}px`);

	setMemeBoxContent();
};

document.addEventListener("mousedown", e => {
	//right click
	if (e.button == 2) {
		clickedEl = e.target;
	}
}, true);

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
	if (request.text && (request.text == "make_meme")) {
		trackGAEvent('image_dimensions', `${clickedEl.width}x${clickedEl.height}`);
		if (clickedEl.width >= minImageWidth && clickedEl.height >= minImageHeight) {
			setMemeBox();
			sendResponse({ele: clickedEl.innerHTML});
		} else {
			showWarningBox();
		}
		return true;
	}
});