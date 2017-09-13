var memeTexts = document.querySelectorAll('.js-meme-text'),
    memePosBtns = document.querySelectorAll('.js-pos-btn'),
    memeSizeBtns = document.querySelectorAll('.js-size-btn'),
    memeOptionsBox = document.querySelector('.js-meme-options'),
    memeDownloadBtn = document.getElementById('js-download-meme'),
    memeBox = document.getElementById('js-meme-box');

var defaultPosition = 'center';
var defaultFontSize = 'medium';
var selectedTextType, selectedText;
var memeOptionSelected = false;

var memeOptions = {
    'top': {
        'size': defaultFontSize,
        'pos': defaultPosition
    },
    'bottom': {
        'size': defaultFontSize,
        'pos': defaultPosition
    }
};

function setMemeOptionsBoxPosition() {
    memeOptionsBox.style.top = (selectedTextType === 'bottom' ? selectedText.offsetTop - memeOptionsBox.offsetHeight - 10: selectedText.offsetTop + selectedText.offsetHeight) + 'px';
}

function showMemeOptionsBox() {
    memeOptionsBox.style.display = 'block';
    memeOptionsBox.setAttribute('type', selectedTextType);
}

function hideMemeOptionsBox() {
    memeOptionsBox.style.display = 'none';
}

function setMemeOptionsBox(optionType) {
    var memeGroupOptions = memeOptionsBox.querySelectorAll('[data-' + optionType + ']');
    [].forEach.call(memeGroupOptions, function (memeGroupOption) {
        memeGroupOption.classList.remove('selected');
        if (memeGroupOption.getAttribute('data-' + optionType) === memeOptions[selectedTextType][optionType]) {
            memeGroupOption.classList.add('selected');
        }
    });
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

[].forEach.call(memeTexts, function (memeText) {
    memeText.setAttribute('data-pos', defaultPosition);
    memeText.setAttribute('data-size', defaultFontSize);

    setMemeTextHeight(memeText);

    memeText.addEventListener('input', function () {
        adjustHeight(this, this.minHeight);
        setMemeOptionsBoxPosition();
    });

    memeText.addEventListener('focus', function () {
        console.log('fouccsed')
        var type = this.getAttribute('data-type');
        memeText.classList.add('selected');
        selectedTextType = type;
        selectedText = memeText;
        ['size', 'pos'].forEach(function (optionType) {
            setMemeOptionsBox(optionType);
        });
        showMemeOptionsBox();
        setMemeOptionsBoxPosition();
    });
    
    memeText.addEventListener('blur', function (e) {
        if(!memeOptionSelected) {
            memeText.classList.remove('selected');
            hideMemeOptionsBox();
        }
    });
});

[].forEach.call(memePosBtns, function (memePosBtn) {
    memePosBtn.addEventListener('mousedown', function () {
        memeOptionSelected = true;
        var position = this.getAttribute('data-pos');
        console.log(position);
        selectedText.setAttribute('data-pos', position);
        memeOptions[selectedTextType]['pos'] = position;
        setMemeOptionsBox('pos');
        setTimeout(function () {
            selectedText.focus();
        }, 0);
    });

    memePosBtn.addEventListener('mouseout', function (e) {
        memeOptionSelected = false;
    });
});

[].forEach.call(memeSizeBtns, function (memeSizeBtn) {
    memeSizeBtn.addEventListener('mousedown', function () {
        memeOptionSelected = true;
        var fontSize = this.getAttribute('data-size');
        console.log(fontSize);
        selectedText.setAttribute('data-size', fontSize);
        memeOptions[selectedTextType]['size'] = fontSize;
        setMemeOptionsBox('size');
        setMemeTextHeight(selectedText);
        setMemeOptionsBoxPosition();
        setTimeout(function () {
            selectedText.focus();
        }, 0);
    });

    memeSizeBtn.addEventListener('mouseout', function (e) {
        memeOptionSelected = false;
    });
});

memeDownloadBtn.addEventListener('click', function () {

/*    html2canvas(document.body, {
        onrendered: function(canvas) {
            document.body.appendChild(canvas);
        }
    });*/

    function onImgLoad(image) {
        var c = document.createElement('canvas');
        var iframeBounds = image.getBoundingClientRect();
        c.width = iframeBounds.width;
        c.height = iframeBounds.height;
        var ctx = c.getContext('2d');
        ctx.drawImage(
            image,
            iframeBounds.left,
            iframeBounds.top,
            iframeBounds.width,
            iframeBounds.height,
            0,
            0,
            iframeBounds.width,
            iframeBounds.height
        );
        image.removeEventListener('load', onImgLoad);
        document.body.appendChild(c);
    }

    chrome.tabs.captureVisibleTab(
        null,
        {format: 'png', quality: 100},
        function (dataURI) {
            if (dataURI) {
                var image = new Image();
                image.src = dataURI;
                image.addEventListener('load', function () {
                    onImgLoad(image, dataURI)
                });
            }
        }
    );
});