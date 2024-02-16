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

let selectedImage = selectedTextType = selectedText = null;
let memePopup = memePopupOverlay = memeTextOptionsBox = memeTexts = memePosBtns = memeSizeBtns = null;
let memeDownloadBtn = memeRefreshBtn = memeCancelBtn = null;
let warningPopup = warningPopupTimer = null;

// Sets the position of meme options box based on type of text
function setMemeTextOptionsBoxPosition() {
	memeTextOptionsBox.style.top = (selectedTextType === 'bottom' ? selectedText.offsetTop - memeTextOptionsBox.offsetHeight - 20 : selectedText.offsetTop + selectedText.offsetHeight) + 'px';
};

// Adjusts the height of current meme text element
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

// Sets the height of current meme text element
function setMemeTextHeight(memeText) {
	// we adjust height to the initial content
	memeText.style.height = 0;
	memeText.minHeight = memeText.scrollHeight;
	adjustHeight(memeText, memeText.minHeight);
};

// Shows meme text options box
function showMemeTextOptionsBox() {
	memeTextOptionsBox.style.opacity = 1;
	memeTextOptionsBox.style.visibility = 'visible';
};

// Hides meme text options box
function hideMemeTextOptionsBox() {
	memeTextOptionsBox.style.opacity = 0;
	memeTextOptionsBox.style.visibility = 'hidden';
};

// Sends a GA tracking event handled by the 'service-worker'
function trackGAEvent(eventName, eventParams = {}) {
	chrome.runtime.sendMessage({
		msg: 'track_GA_event',
		eventName,
		eventParams
	});
};

// Sets/Unsets various text option buttons based on current settings
function setMemeTextOptionsBox(optionType) {
	const memeGroupOptions = memeTextOptionsBox.querySelectorAll(`[data-${optionType}]`);
	memeGroupOptions.forEach(memeGroupOption => {
		memeGroupOption.classList.remove('selected');
		if (memeGroupOption.getAttribute(`data-${optionType}`) === memeTextOptions[selectedTextType][optionType]) {
			memeGroupOption.classList.add('selected');
		}
	});
};

// Resets the meme to default settings
function resetMemeTextOptions(memeText) {
	const textType = memeText.getAttribute('data-type');
	memeText.value = memeTextOptions[textType]['defaultText'];
	memeTextOptions[textType]['size'] = defaultFontSize;
	memeTextOptions[textType]['pos'] = defaultPosition;
	memeText.setAttribute('data-pos', memeTextOptions[textType]['pos']);
	memeText.setAttribute('data-size', memeTextOptions[textType]['size']);
};

// Adds event listeners on various components of the meme popup
function setMemePopupEvents() {
	memeTexts = memePopup.querySelectorAll('.js-memefy_meme-text');
	memeTextOptionsBox = memePopup.querySelector('.js-memefy_meme-text-options');
	memePosBtns = memePopup.querySelectorAll('.js-memefy_pos-btn');
	memeSizeBtns = memePopup.querySelectorAll('.js-memefy_size-btn');
	memeDownloadBtn = memePopup.querySelector('.js-memefy_download-meme');
	memeCancelBtn = memePopup.querySelector('.js-memefy_cancel-meme');
	memeRefreshBtn = memePopup.querySelector('.js-memefy_refresh-meme');

	memeTexts.forEach(memeText => {
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
			setMemeTextOptionsBox('size');
			setMemeTextOptionsBox('pos');
			showMemeTextOptionsBox();
			setMemeTextOptionsBoxPosition();
		});

		memeText.addEventListener('blur', function () {
			if (!memeTextOptionSelected) {
				this.classList.remove('selected');
				hideMemeTextOptionsBox();
			}
		});
	});
	
	memePosBtns.forEach(memePosBtn => {
		memePosBtn.addEventListener('mousedown', function () {
			const position = this.getAttribute('data-pos');
			memeTextOptionSelected = true;
			selectedText.setAttribute('data-pos', position);
			memeTextOptions[selectedTextType]['pos'] = position;
			setMemeTextOptionsBox('pos');
			setTimeout(() => selectedText.focus(), 0);
		});

		memePosBtn.addEventListener('mouseout', () => {
			memeTextOptionSelected = false;
		});
	});

	memeSizeBtns.forEach(memeSizeBtn => {
		memeSizeBtn.addEventListener('mousedown', function () {
			const fontSize = this.getAttribute('data-size');
			memeTextOptionSelected = true;
			selectedText.setAttribute('data-size', fontSize);
			memeTextOptions[selectedTextType]['size'] = fontSize;
			setMemeTextOptionsBox('size');
			setMemeTextHeight(selectedText);
			setMemeTextOptionsBoxPosition();
			setTimeout(() => selectedText.focus(), 0);
		});

		memeSizeBtn.addEventListener('mouseout', () => {
			memeTextOptionSelected = false;
		});
	});

	memeCancelBtn.addEventListener('click', () => {
		memePopupOverlay.parentNode.removeChild(memePopupOverlay);
		memePopup.parentNode.removeChild(memePopup);
		document.body.classList.remove('_memefy_body');
		trackGAEvent('meme_cancel');
	});

	function onImgLoad(image) {
		let c = document.createElement('canvas');
		const iframeBounds = memePopup.getBoundingClientRect();
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
				if (response?.imgSrc) {
					let image = new Image();
					image.src = response.imgSrc;
					image.addEventListener('load', () => onImgLoad(image));
					trackGAEvent('meme_download');
				}
			});
		}, 0);
	});

	memeRefreshBtn.addEventListener('click', () => {
		memeTexts.forEach(memeText => {
			resetMemeTextOptions(memeText);
			setMemeTextHeight(memeText);
		});
		trackGAEvent('meme_refresh');
	});
};

// Hides warning popup after manual or automatic close
function hideWarningPopup() {
	warningPopup.style.opacity = 0;
	warningPopup.style.visibility = 'hidden';
};

// Shows warning popup when the selected image is not qualified for generating meme
function showWarningPopup() {
	if (!warningPopup) {
		warningPopup = document.createElement('div');
		warningPopup.classList.add('js-memefy_warning-box', '_memefy_warning-box');
		warningPopup.innerHTML = warningPopupTemplate;
		document.body.appendChild(warningPopup);

		warningPopup.querySelector('.js-memefy_close-warning-box').addEventListener('click', () => {
			clearTimeout(warningPopupTimer);
			hideWarningPopup();
		});
	}

	warningPopup.style.opacity = 1;
	warningPopup.style.visibility = 'visible';
	clearTimeout(warningPopupTimer);
	warningPopupTimer = setTimeout(() => {
		hideWarningPopup();
	}, warningPopupExpiry);

	trackGAEvent('warning_show');
};

// Creates a popup where the meme can be edited and downloaded
function createMemePopup() {
	let selectedImageWidth = selectedImage.width,
		selectedImageHeight = selectedImage.height,
		windowWidth = window.innerWidth,
		windowHeight = window.innerHeight,
		memePopupWidth = selectedImageWidth,
		memePopupHeight = selectedImageHeight;

	memePopup = document.createElement('div');
	memePopup.classList.add('js-memefy_meme-box', '_memefy_meme-box');

	if (memePopupWidth >= windowWidth) {
		memePopupWidth = windowWidth - 30;
		memePopupHeight = selectedImageHeight / selectedImageWidth * memePopupWidth;
	}

	if (memePopupHeight >= windowHeight) {
		memePopupHeight = windowHeight - 10;
		memePopupWidth = selectedImageWidth / selectedImageHeight * memePopupHeight;
	}

	memePopup.style.width = `${memePopupWidth}px`;
	memePopup.style.height = `${memePopupHeight}px`;

	memePopup.style.backgroundImage = `url("${selectedImage.src}")`;
	memePopup.innerHTML= memePopupTemplate;
	document.body.appendChild(memePopup);

	memePopupOverlay = document.createElement('div');
	memePopupOverlay.classList.add('js-memefy_meme-box-overlay', '_memefy_meme-box-overlay');
	document.body.appendChild(memePopupOverlay);
	document.body.classList.add('_memefy_body');
	trackGAEvent('meme_show', {
		'width': `${memePopupWidth}px`,
		'height': `${memePopupHeight}px`
	});
	setMemePopupEvents();
};

// Event listener that stores the target element (selected image) once you right-click on it
document.addEventListener("mousedown", e => {
	if (e.button == 2) {
		selectedImage = e.target;
	}
}, true);

// Event listener that is sent from 'service-worker' to create meme
chrome.runtime.onMessage.addListener((request, _sender, sendResponse) => {
	if (request?.msg === "make_meme") {
		trackGAEvent('image_select', {
			'width': `${selectedImage.width}px`,
			'height': `${selectedImage.height}px`
		});
		// Check whether the selected image is qualified to create the meme
		if (selectedImage.width >= minImageWidth && selectedImage.height >= minImageHeight) {
			createMemePopup();
			sendResponse({ele: selectedImage.innerHTML});
		} else {
			showWarningPopup();
		}
		return true;
	}
});