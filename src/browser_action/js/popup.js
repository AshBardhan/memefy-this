var memeTexts = document.querySelectorAll('.js-meme-text'),
    memeBtns = document.querySelectorAll('.js-btn');

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
    memeText.minHeight = memeText.scrollHeight;

    memeText.addEventListener('input', function () {
        adjustHeight(this, this.minHeight);
    });

    // we adjust height to the initial content
    adjustHeight(memeText, memeText.minHeight);
});

[].forEach.call(memeBtns, function (memeBtn) {
    memeBtn.onclick = function (e) {
        var position = this.getAttribute('data-pos');
        console.log(position);
        memeTexts[0].classList.remove('meme-text--center', 'meme-text--left', 'meme-text--right');
        memeTexts[0].classList.add('meme-text--' + position);
    };
});
