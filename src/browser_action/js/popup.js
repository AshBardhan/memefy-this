var memeTexts = document.getElementsByClassName('js-meme-text');

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

[].forEach.call(memeTexts, function (memeText) {
    var minHeight = memeText.scrollHeight;

    memeText.addEventListener('input', function () {
        adjustHeight(this, minHeight);
    });

    // we adjust height to the initial content
    adjustHeight(memeText, minHeight);
});