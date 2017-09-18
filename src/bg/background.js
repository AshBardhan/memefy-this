// Copyright (c) 2010 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

// A generic onclick callback function.
function genericOnClick(info, tab) {
    console.log("item " + info.menuItemId + " was clicked");
    console.log("info: " + JSON.stringify(info));
    console.log("tab: " + JSON.stringify(tab));
}

chrome.contextMenus.create({
    id: "myContextMenu",   // <-- mandatory with event-pages
    title: "Memefy this",
    contexts: ["image"]
});

/* Register a listener for the `onClicked` event */
chrome.contextMenus.onClicked.addListener(function(info, tab) {
    if (tab) {
        chrome.tabs.sendMessage(tab.id, { text: "report_back" }, function(response) {
            console.log(response);
        });

    }
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if(request.msg && request.msg === 'download_meme') {
        console.log(request.msg);
        chrome.tabs.captureVisibleTab(
            null,
            {format: 'png', quality: 100},
            function (dataURL) {
                sendResponse({imgSrc: dataURL});
            }
        );
        return true;
    }
});
