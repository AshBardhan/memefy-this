var memeTexts = document.querySelectorAll('.js-meme-text'),
    memePosBtns = document.querySelectorAll('.js-pos-btn'),
    memeSizeBtns = document.querySelectorAll('.js-size-btn'),
    memeOptions  = document.querySelector('.js-meme-options');

var defaultPosition = 'center';
var defaultFontSize = 'medium';
var currentSelectedText;

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
    });

    memeText.addEventListener('focus', function () {
        var type = this.getAttribute('data-type');
        console.log(type);
        memeOptions.style.top = (type === 'bottom' ? memeText.offsetTop - memeOptions.offsetHeight : memeText.offsetTop + memeText.offsetHeight) + 'px';
        currentSelectedText = type;
    })
});

[].forEach.call(memePosBtns, function (memePosBtn) {
    memePosBtn.onclick = function () {
        var position = this.getAttribute('data-pos');
        console.log(position);
        memeTexts[0].setAttribute('data-pos', position);
    };
});

[].forEach.call(memeSizeBtns, function (memeSizeBtn) {
    memeSizeBtn.onclick = function () {
        var fontSize = this.getAttribute('data-size');
        console.log(fontSize);
        memeTexts[0].setAttribute('data-size', fontSize);
        setMemeTextHeight(memeTexts[0])
    };
});