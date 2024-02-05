
const defaultPosition = 'center';
const defaultFontSize = 'medium';
let memeTextOptionSelected = false;
const minImageWidth = 320;
const minImageHeight = 240;
const warningBoxExpiry = 10000;
let memeTextOptions = {
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

let clickedEl = selectedTextType = selectedText = null;
let memeBox = memeBoxOverlay = memeTextOptionsBox = memeTexts = memePosBtns = memeSizeBtns = null;
let memeDownloadBtn = memeRefreshBtn = memeCancelBtn = null;
let warningBox = warningBoxTimer = null;

setMemeTextOptionsBoxPosition = function () {
	memeTextOptionsBox.style.top = (selectedTextType === 'bottom' ? selectedText.offsetTop - memeTextOptionsBox.offsetHeight - 20 : selectedText.offsetTop + selectedText.offsetHeight) + 'px';
};

adjustHeight = function (el, minHeight) {
	// compute the height difference which is caused by border and outline
	const outerHeight = parseInt(window.getComputedStyle(el).height, 10);
	const diff = outerHeight - el.clientHeight;

	// set the height to 0 in case of it has to be shrinked
	el.style.height = 0;

	// set the correct height
	// el.scrollHeight is the full height of the content, not just the visible part
	el.style.height = Math.max(minHeight, el.scrollHeight + diff) + 'px';
};

setMemeTextHeight = function (memeText) {
	// we adjust height to the initial content
	memeText.style.height = 0;
	memeText.minHeight = memeText.scrollHeight;
	adjustHeight(memeText, memeText.minHeight);
};

showMemeTextOptionsBox = function () {
	memeTextOptionsBox.style.opacity = 1;
	memeTextOptionsBox.style.visibility = 'visible';
	memeTextOptionsBox.setAttribute('type', selectedTextType);
};

hideMemeTextOptionsBox = function () {
	memeTextOptionsBox.style.opacity = 0;
	memeTextOptionsBox.style.visibility = 'hidden';
};

trackGAEvent = function (eventName, eventValue) {
	chrome.runtime.sendMessage({
		msg: 'track_GA_event',
		eventName: eventName,
		eventValue: eventValue
	});
};

setMemeTextOptionsBox = function (optionType) {
	const memeGroupOptions = memeTextOptionsBox.querySelectorAll(`[data-${optionType}]`);
	[].forEach.call(memeGroupOptions, memeGroupOption => {
		memeGroupOption.classList.remove('selected');
		if (memeGroupOption.getAttribute(`data-${optionType}`) === memeTextOptions[selectedTextType][optionType]) {
			memeGroupOption.classList.add('selected');
		}
	});
};

setMemeBoxOption = function () {
	['size', 'pos'].forEach(optionType => setMemeTextOptionsBox(optionType));
};

resetMemeTextOptions = function (memeText) {
	const textType = memeText.getAttribute('data-type');
	memeText.value = memeTextOptions[textType]['defaultText'];
	memeTextOptions[textType]['size'] = defaultFontSize;
	memeTextOptions[textType]['pos'] = defaultPosition;
	memeText.setAttribute('data-pos', memeTextOptions[textType]['pos']);
	memeText.setAttribute('data-size', memeTextOptions[textType]['size']);
};

setMemeBoxContent = function () {
	memeTexts = memeBox.querySelectorAll('.js-memefy_meme-text');
	memeTextOptionsBox = memeBox.querySelector('.js-memefy_meme-text-options');
	memePosBtns = memeBox.querySelectorAll('.js-memefy_pos-btn');
	memeSizeBtns = memeBox.querySelectorAll('.js-memefy_size-btn');
	memeDownloadBtn = memeBox.querySelector('.js-memefy_download-meme');
	memeCancelBtn = memeBox.querySelector('.js-memefy_cancel-meme');
	memeRefreshBtn = memeBox.querySelector('.js-memefy_refresh-meme');

	[].forEach.call(memeTexts, function (memeText) {
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

	
	[].forEach.call(memePosBtns, function (memePosBtn) {
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

	[].forEach.call(memeSizeBtns, function (memeSizeBtn) {
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
		[].forEach.call(memeTexts, memeText => {
			resetMemeTextOptions(memeText);
			setMemeTextHeight(memeText);
		});
		trackGAEvent('meme_refresh', 'click');
	});
};

hideWarningBox = function () {
	warningBox.style.opacity = 0;
	warningBox.style.visibility = 'hidden';
};

showWarningBox = function () {
	if (!warningBox) {
		warningBox = document.createElement('div');
		warningBox.classList.add('js-memefy_warning-box', '_memefy_warning-box');
		warningBox.innerHTML = `
			Can't Memefy image below&nbsp;<b>320 x 240 px</b>&nbsp;in size
			<span class="js-memefy_close-warning-box _memefy_close-warning-box">
				<svg xmlns="http://www.w3.org/2000/svg" version="1.1" x="0px" y="0px" viewBox="0 0 47.971 47.971" xml:space="preserve" width="8px" height="8px" fill="currentColor">
					<path d="M28.228,23.986L47.092,5.122c1.172-1.171,1.172-3.071,0-4.242c-1.172-1.172-3.07-1.172-4.242,0L23.986,19.744L5.121,0.88 c-1.172-1.172-3.07-1.172-4.242,0c-1.172,1.171-1.172,3.071,0,4.242l18.865,18.864L0.879,42.85c-1.172,1.171-1.172,3.071,0,4.242 C1.465,47.677,2.233,47.97,3,47.97s1.535-0.293,2.121-0.879l18.865-18.864L42.85,47.091c0.586,0.586,1.354,0.879,2.121,0.879 s1.535-0.293,2.121-0.879c1.172-1.171,1.172-3.071,0-4.242L28.228,23.986z"/>
				</svg>
			</span>
		`;
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

setMemeBox = function () {
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
	memeBox.innerHTML = `
		<textarea rows="1" spellcheck="false" title="Click here to change text" class="_memefy_meme-text js-memefy_meme-text" tabindex="1" data-type="top"></textarea>
		<textarea rows="1" spellcheck="false" title="Click here to change text" class="_memefy_meme-text  js-memefy_meme-text" tabindex="1" data-type="bottom"></textarea>
		<div id="_memefy_meme-text-options" class="js-memefy_meme-text-options">
			<div class="_memefy_btn js-memefy_pos-btn" data-pos="left">
				<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" xml:space="preserve">
					<path d="M0,5 h24"/><path d="M0,12 h18"/><path d="M0,19 h12"/>
				</svg>
			</div>
			<div class="_memefy_btn js-memefy_pos-btn" data-pos="center">
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" xml:space="preserve">
					<path d="M0,5 h24"/><path d="M3,12 h18"/><path d="M6,19 h12"/>
				</svg>
			</div>
			<div class="_memefy_btn js-memefy_pos-btn" data-pos="right">
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" xml:space="preserve">
					<path d="M0,5 h24"/><path d="M6,12 h18"/><path d="M12,19 h12"/>
				</svg>
			</div>
			<div class="_memefy_btn js-memefy_size-btn" data-size="xsmall">
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" xml:space="preserve">
					<text x="6" y="16" font-family="Helvetica" font-size="8">XS</text>
				</svg>
			</div>
			<div class="_memefy_btn js-memefy_size-btn" data-size="small">
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" xml:space="preserve">
					<text x="8" y="16" font-family="Helvetica" font-size="10">S</text>
				</svg>
			</div>
			<div class="_memefy_btn js-memefy_size-btn" data-size="medium">
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" xml:space="preserve">
					<text x="7" y="16" font-family="Helvetica" font-size="12">M</text>
				</svg>
			</div>
			<div class="_memefy_btn js-memefy_size-btn" data-size="large">
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" xml:space="preserve">
					<text x="7" y="17" font-family="Helvetica" font-size="14">L</text>
				</svg>
			</div>
			<div class="_memefy_btn js-memefy_size-btn" data-size="xlarge">
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" xml:space="preserve">
					<text x="2" y="18" font-family="Helvetica" font-size="16">XL</text>
				</svg>
			</div>
		</div>
		<ul id="_memefy_meme-box-options">
			<li class="js-memefy_cancel-meme _memefy_cancel-meme" title="Cancel" role="button" tabindex="2">
				<svg xmlns="http://www.w3.org/2000/svg" version="1.1" x="0px" y="0px" viewBox="0 0 47.971 47.971" xml:space="preserve" width="512px" height="512px">
					<g id="icon-cancel">
						<path d="M28.228,23.986L47.092,5.122c1.172-1.171,1.172-3.071,0-4.242c-1.172-1.172-3.07-1.172-4.242,0L23.986,19.744L5.121,0.88 c-1.172-1.172-3.07-1.172-4.242,0c-1.172,1.171-1.172,3.071,0,4.242l18.865,18.864L0.879,42.85c-1.172,1.171-1.172,3.071,0,4.242   C1.465,47.677,2.233,47.97,3,47.97s1.535-0.293,2.121-0.879l18.865-18.864L42.85,47.091c0.586,0.586,1.354,0.879,2.121,0.879   s1.535-0.293,2.121-0.879c1.172-1.171,1.172-3.071,0-4.242L28.228,23.986z"/>
					</g>
				</svg>
			</li>
			<li class="js-memefy_download-meme _memefy_download-meme" title="Download" role="button" tabindex="2">
				<svg xmlns="http://www.w3.org/2000/svg" version="1.1" x="0px" y="0px" width="512px" height="512px" viewBox="0 0 433.5 433.5" xml:space="preserve">
					<g id="icon-download">
						<path d="M395.25,153h-102V0h-153v153h-102l178.5,178.5L395.25,153z M38.25,382.5v51h357v-51H38.25z"/>
					</g>
				</svg>
			</li>
			<li class="js-memefy_refresh-meme _memefy_refresh-meme" title="Refresh" role="button" tabindex="2">
				<svg xmlns="http://www.w3.org/2000/svg" version="1.1" x="0px" y="0px" width="512px" height="512px" viewBox="0 0 408 408" xml:space="preserve">
					<g id="icon-refresh">
						<path d="M346.8,61.2C311.1,22.95,260.1,0,204,0C91.8,0,0,91.8,0,204s91.8,204,204,204c94.35,0,173.4-66.3,196.35-153H346.8 C326.4,313.65,270.3,357,204,357c-84.15,0-153-68.85-153-153c0-84.15,68.85-153,153-153c43.35,0,79.05,17.85,107.1,45.9    l-81.6,81.6H408V0L346.8,61.2z"/>
					</g>
				</svg>
			</li>
		</ul>
	`;
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