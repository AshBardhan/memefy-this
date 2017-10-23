(function (_memefy) {
    _memefy.init();
})(
new function () {
    var self = this;
    this.defaultPosition = 'center';
    this.defaultFontSize = 'medium';
    this.memeTextOptionSelected = false;
    this.memeTextOptions = {
        'top': {
            'size': this.defaultFontSize,
            'pos': this.defaultPosition,
            'defaultText': 'Top Text'
        },
        'bottom': {
            'size': this.defaultFontSize,
            'pos': this.defaultPosition,
            'defaultText': 'Bottom Text'
        }
    };

    this.clickedEl = this.selectedTextType = this.selectedText = null;
    this.memeBox = this.memeBoxOverlay = this.memeTextOptionsBox = this.memeTexts = this.memePosBtns = this.memeSizeBtns = null;
    this.memeDownloadBtn = this.memeRefreshBtn = this.memeCancelBtn = null;

    this.setMemeTextOptionsBoxPosition = function () {
        self.memeTextOptionsBox.style.top = (self.selectedTextType === 'bottom' ? self.selectedText.offsetTop - self.memeTextOptionsBox.offsetHeight - 20 : self.selectedText.offsetTop + self.selectedText.offsetHeight) + 'px';
    };

    this.adjustHeight = function (el, minHeight) {
        // compute the height difference which is caused by border and outline
        var outerHeight = parseInt(window.getComputedStyle(el).height, 10);
        var diff = outerHeight - el.clientHeight;

        // set the height to 0 in case of it has to be shrinked
        el.style.height = 0;

        // set the correct height
        // el.scrollHeight is the full height of the content, not just the visible part
        el.style.height = Math.max(minHeight, el.scrollHeight + diff) + 'px';
    };

    this.setMemeTextHeight = function (memeText) {
        // we adjust height to the initial content
        memeText.style.height = 0;
        memeText.minHeight = memeText.scrollHeight;
        this.adjustHeight(memeText, memeText.minHeight);
    };

    this.showMemeTextOptionsBox = function () {
        self.memeTextOptionsBox.style.display = 'block';
        self.memeTextOptionsBox.setAttribute('type', self.selectedTextType);
    };

    this.hideMemeTextOptionsBox = function () {
        this.memeTextOptionsBox.style.display = 'none';
    };

    this.setMemeTextOptionsBox = function (optionType) {
        var memeGroupOptions = this.memeTextOptionsBox.querySelectorAll('[data-' + optionType + ']');
        [].forEach.call(memeGroupOptions, function (memeGroupOption) {
            memeGroupOption.classList.remove('selected');
            if (memeGroupOption.getAttribute('data-' + optionType) === self.memeTextOptions[self.selectedTextType][optionType]) {
                memeGroupOption.classList.add('selected');
            }
        });
    };

    this.setMemeBoxOption = function () {
        ['size', 'pos'].forEach(function (optionType) {
            self.setMemeTextOptionsBox(optionType);
        });
    };

    this.resetMemeTextOptions = function (memeText) {
        var textType = memeText.getAttribute('data-type');
        memeText.value = self.memeTextOptions[textType]['defaultText'];
        self.memeTextOptions[textType]['size'] = self.defaultFontSize;
        self.memeTextOptions[textType]['pos'] = self.defaultPosition;
        memeText.setAttribute('data-pos', self.memeTextOptions[textType]['pos']);
        memeText.setAttribute('data-size', self.memeTextOptions[textType]['size']);
    };

    this.setMemeBoxContent = function () {
        this.memeTexts = this.memeBox.querySelectorAll('.js-memefy_meme-text');
        this.memeTextOptionsBox = this.memeBox.querySelector('.js-memefy_meme-text-options');
        this.memePosBtns = this.memeBox.querySelectorAll('.js-memefy_pos-btn');
        this.memeSizeBtns = this.memeBox.querySelectorAll('.js-memefy_size-btn');
        this.memeDownloadBtn = this.memeBox.querySelector('.js-memefy_download-meme');
        this.memeCancelBtn = this.memeBox.querySelector('.js-memefy_cancel-meme');
        this.memeRefreshBtn = this.memeBox.querySelector('.js-memefy_refresh-meme');

        [].forEach.call(self.memeTexts, function (memeText) {
            self.resetMemeTextOptions(memeText);
            self.setMemeTextHeight(memeText);

            memeText.addEventListener('input', function () {
                self.adjustHeight(this, this.minHeight);
                self.setMemeTextOptionsBoxPosition();
            });

            memeText.addEventListener('focus', function () {
                var type = this.getAttribute('data-type');
                this.classList.add('selected');
                self.selectedTextType = type;
                self.selectedText = memeText;
                self.setMemeBoxOption();
                self.showMemeTextOptionsBox();
                self.setMemeTextOptionsBoxPosition();
            });

            memeText.addEventListener('blur', function () {
                if (!self.memeTextOptionSelected) {
                    this.classList.remove('selected');
                    self.hideMemeTextOptionsBox();
                }
            });
        });

        [].forEach.call(self.memePosBtns, function (memePosBtn) {
            memePosBtn.addEventListener('mousedown', function () {
                var position = this.getAttribute('data-pos');
                self.memeTextOptionSelected = true;
                self.selectedText.setAttribute('data-pos', position);
                self.memeTextOptions[self.selectedTextType]['pos'] = position;
                self.setMemeTextOptionsBox('pos');
                setTimeout(function () {
                    self.selectedText.focus();
                }, 0);
            });

            memePosBtn.addEventListener('mouseout', function (e) {
                self.memeTextOptionSelected = false;
            });
        });

        [].forEach.call(self.memeSizeBtns, function (memeSizeBtn) {
            memeSizeBtn.addEventListener('mousedown', function () {
                var fontSize = this.getAttribute('data-size');
                self.memeTextOptionSelected = true;
                self.selectedText.setAttribute('data-size', fontSize);
                self.memeTextOptions[self.selectedTextType]['size'] = fontSize;
                self.setMemeTextOptionsBox('size');
                self.setMemeTextHeight(self.selectedText);
                self.setMemeTextOptionsBoxPosition();
                setTimeout(function () {
                    self.selectedText.focus();
                }, 0);
            });

            memeSizeBtn.addEventListener('mouseout', function () {
                self.memeTextOptionSelected = false;
            });
        });

        self.memeCancelBtn.addEventListener('click', function () {
            self.memeBoxOverlay.parentNode.removeChild(self.memeBoxOverlay);
            self.memeBox.parentNode.removeChild(self.memeBox);
            document.body.classList.remove('_memefy_body');

        });

        function onImgLoad(image) {
            var c = document.createElement('canvas');
            var iframeBounds = self.memeBox.getBoundingClientRect();
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
                    'memefy',
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
            link.addEventListener('click', function (e) {
                e.stopPropagation();
            });
            link.click();
            link.parentNode.removeChild(link);
        }

        self.memeDownloadBtn.addEventListener('click', function () {
            setTimeout(function () {
                chrome.runtime.sendMessage({msg: 'download_meme'}, function (response) {
                    if (response && response.imgSrc) {
                        var image = new Image();
                        image.src = response.imgSrc;
                        image.addEventListener('load', function () {
                            onImgLoad(image);
                        });
                    }
                });
            }, 0);
        });

        self.memeRefreshBtn.addEventListener('click', function () {
            [].forEach.call(self.memeTexts, function (memeText) {
                self.resetMemeTextOptions(memeText);
                self.setMemeTextHeight(memeText);
            });
        });
    };

    this.setMemeBox = function () {
        var clickedElWidth = this.clickedEl.width,
            clickedElHeight = this.clickedEl.height,
            windowWidth = window.innerWidth,
            windowHeight = window.innerHeight,
            memeBoxWidth = clickedElWidth,
            memeBoxHeight = clickedElHeight;

        this.memeBox = document.createElement('div');
        this.memeBox.classList.add('js-memefy_meme-box', '_memefy_meme-box');

        if (memeBoxWidth >= windowWidth) {
            memeBoxWidth = windowWidth - 30;
            memeBoxHeight = clickedElHeight / clickedElWidth * memeBoxWidth;
        }

        if (memeBoxHeight >= windowHeight) {
            memeBoxHeight = windowHeight - 10;
            memeBoxWidth = clickedElWidth / clickedElHeight * memeBoxHeight;
        }

        this.memeBox.style.width = memeBoxWidth + 'px';
        this.memeBox.style.height = memeBoxHeight + 'px';

        this.memeBox.style.backgroundImage = 'url("' + this.clickedEl.src + '")';
        this.memeBox.innerHTML =
            '<textarea rows="1" spellcheck="false" title="Click here to change text" class="_memefy_meme-text js-memefy_meme-text" tabindex="-1" data-type="top"></textarea> ' +
            '<textarea rows="1" spellcheck="false" title="Click here to change text" class="_memefy_meme-text  js-memefy_meme-text" tabindex="-1" data-type="bottom"></textarea>' +
            '<div id="_memefy_meme-text-options" class="js-memefy_meme-text-options">' +
                '<div class="_memefy_btn js-memefy_pos-btn" data-pos="left">' +
					'<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" xml:space="preserve">' +
						'<path d="M0,5 h24"/><path d="M0,12 h18"/><path d="M0,19 h12"/>' +
					'</svg>' +
                '</div>' +
                '<div class="_memefy_btn js-memefy_pos-btn" data-pos="center">' +
					'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" xml:space="preserve">' +
						'<path d="M0,5 h24"/><path d="M3,12 h18"/><path d="M6,19 h12"/>' +
					'</svg>' +
                '</div>' +
                '<div class="_memefy_btn js-memefy_pos-btn" data-pos="right">' +
					'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" xml:space="preserve">' +
						'<path d="M0,5 h24"/><path d="M6,12 h18"/><path d="M12,19 h12"/>' +
					'</svg>' +
                '</div>' +
                '<div class="_memefy_btn js-memefy_size-btn" data-size="xsmall">' +
					'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" xml:space="preserve">' +
						'<text x="6" y="16" font-family="Helvetica" font-size="8">XS</text>' +
					'</svg>' +
                '</div>' +
                '<div class="_memefy_btn js-memefy_size-btn" data-size="small">' +
					'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" xml:space="preserve">' +
						'<text x="8" y="16" font-family="Helvetica" font-size="10">S</text>' +
					'</svg>' +
                '</div>' +
                '<div class="_memefy_btn js-memefy_size-btn" data-size="medium">' +
					'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" xml:space="preserve">' +
						'<text x="7" y="16" font-family="Helvetica" font-size="12">M</text>' +
					'</svg>' +
                '</div>' +
                '<div class="_memefy_btn js-memefy_size-btn" data-size="large">' +
					'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" xml:space="preserve">' +
						'<text x="7" y="17" font-family="Helvetica" font-size="14">L</text>' +
					'</svg>' +
                '</div>' +
                '<div class="_memefy_btn js-memefy_size-btn" data-size="xlarge">' +
					'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" xml:space="preserve">' +
						'<text x="2" y="18" font-family="Helvetica" font-size="16">XL</text>' +
					'</svg>' +
                '</div>' +
            '</div>' +
            '<ul id="_memefy_meme-box-options">'+
                '<li class="js-memefy_cancel-meme _memefy_cancel-meme" title="Cancel">' +
					'<svg xmlns="http://www.w3.org/2000/svg" version="1.1" x="0px" y="0px" viewBox="0 0 47.971 47.971" xml:space="preserve" width="512px" height="512px">' +
						'<g id="icon-cancel">' +
							'<path d="M28.228,23.986L47.092,5.122c1.172-1.171,1.172-3.071,0-4.242c-1.172-1.172-3.07-1.172-4.242,0L23.986,19.744L5.121,0.88 c-1.172-1.172-3.07-1.172-4.242,0c-1.172,1.171-1.172,3.071,0,4.242l18.865,18.864L0.879,42.85c-1.172,1.171-1.172,3.071,0,4.242   C1.465,47.677,2.233,47.97,3,47.97s1.535-0.293,2.121-0.879l18.865-18.864L42.85,47.091c0.586,0.586,1.354,0.879,2.121,0.879   s1.535-0.293,2.121-0.879c1.172-1.171,1.172-3.071,0-4.242L28.228,23.986z"/>' +
						'</g>' +
					'</svg>' +
                '</li>' +
                '<li class="js-memefy_download-meme _memefy_download-meme" title="Download">' +
					'<svg xmlns="http://www.w3.org/2000/svg" version="1.1" x="0px" y="0px" width="512px" height="512px" viewBox="0 0 433.5 433.5" xml:space="preserve">' +
						'<g id="icon-download">' +
							'<path d="M395.25,153h-102V0h-153v153h-102l178.5,178.5L395.25,153z M38.25,382.5v51h357v-51H38.25z"/>' +
						'</g>' +
					'</svg>' +
                '</li>' +
                '<li class="js-memefy_refresh-meme _memefy_refresh-meme" title="Refresh">' +
					'<svg xmlns="http://www.w3.org/2000/svg" version="1.1" x="0px" y="0px" width="512px" height="512px" viewBox="0 0 408 408" xml:space="preserve">' +
						'<g id="icon-refresh">' +
							'<path d="M346.8,61.2C311.1,22.95,260.1,0,204,0C91.8,0,0,91.8,0,204s91.8,204,204,204c94.35,0,173.4-66.3,196.35-153H346.8 C326.4,313.65,270.3,357,204,357c-84.15,0-153-68.85-153-153c0-84.15,68.85-153,153-153c43.35,0,79.05,17.85,107.1,45.9    l-81.6,81.6H408V0L346.8,61.2z"/>' +
						'</g>' +
					'</svg>' +
                '</li>' +
            '</ul>';
        document.body.appendChild(this.memeBox);

        this.memeBoxOverlay = document.createElement('div');
        this.memeBoxOverlay.classList.add('js-memefy_meme-box-overlay', '_memefy_meme-box-overlay');
        document.body.appendChild(this.memeBoxOverlay);
        document.body.classList.add('_memefy_body');

        this.setMemeBoxContent();
    };

    this.init = function () {
        document.addEventListener("mousedown", function (event) {
            //right click
            if (event.button == 2) {
                self.clickedEl = event.target;
            }
        }, true);

        chrome.extension.onMessage.addListener(function (request, sender, sendResponse) {
            if (request.text && (request.text == "make_meme")) {
                self.clickedEl.setAttribute('text', 'invaded');
                self.setMemeBox();
                sendResponse({ele: self.clickedEl.innerHTML});
                return true;
            }
        });
    };
});