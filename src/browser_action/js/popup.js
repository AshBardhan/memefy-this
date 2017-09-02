var memeTexts = document.querySelectorAll('.js-meme-text'),
    memePosBtns = document.querySelectorAll('.js-pos-btn'),
    memeSizeBtns = document.querySelectorAll('.js-size-btn'),
    memeOptionsBox = document.querySelector('.js-meme-options');

var defaultPosition = 'center';
var defaultFontSize = 'medium';
var selectedTextType, selectedText;

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

function showMemeOptionsBoxPosition() {
    memeOptionsBox.style.display = 'block';
}

function hideMemeOptionsBoxPosition() {
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
        var type = this.getAttribute('data-type');
        console.log(type);
        memeText.classList.add('selected');
        selectedTextType = type;
        selectedText = memeText;
        ['size', 'pos'].forEach(function (optionType) {
            setMemeOptionsBox(optionType);
        });
        setMemeOptionsBoxPosition();
        showMemeOptionsBoxPosition();
    })
});

[].forEach.call(memePosBtns, function (memePosBtn) {
    memePosBtn.onclick = function () {
        var position = this.getAttribute('data-pos');
        console.log(position);
        selectedText.setAttribute('data-pos', position);
        memeOptions[selectedTextType]['pos'] = position;
        setMemeOptionsBox('pos');
    };
});

[].forEach.call(memeSizeBtns, function (memeSizeBtn) {
    memeSizeBtn.onclick = function () {
        var fontSize = this.getAttribute('data-size');
        console.log(fontSize);
        selectedText.setAttribute('data-size', fontSize);
        memeOptions[selectedTextType]['size'] = fontSize;
        setMemeOptionsBox('size');
        setMemeTextHeight(selectedText);
        setMemeOptionsBoxPosition();
    };
});