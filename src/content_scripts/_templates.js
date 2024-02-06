const memeBoxTemplate  = `
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

const warningBoxTemplate = `
    Can't Memefy image below&nbsp;<b>320 x 240 px</b>&nbsp;in size
    <span class="js-memefy_close-warning-box _memefy_close-warning-box">
        <svg xmlns="http://www.w3.org/2000/svg" version="1.1" x="0px" y="0px" viewBox="0 0 47.971 47.971" xml:space="preserve" width="8px" height="8px" fill="currentColor">
            <path d="M28.228,23.986L47.092,5.122c1.172-1.171,1.172-3.071,0-4.242c-1.172-1.172-3.07-1.172-4.242,0L23.986,19.744L5.121,0.88 c-1.172-1.172-3.07-1.172-4.242,0c-1.172,1.171-1.172,3.071,0,4.242l18.865,18.864L0.879,42.85c-1.172,1.171-1.172,3.071,0,4.242 C1.465,47.677,2.233,47.97,3,47.97s1.535-0.293,2.121-0.879l18.865-18.864L42.85,47.091c0.586,0.586,1.354,0.879,2.121,0.879 s1.535-0.293,2.121-0.879c1.172-1.171,1.172-3.071,0-4.242L28.228,23.986z"/>
        </svg>
    </span>
`;