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
        console.log(info);
        console.log(tab);
        /* Create the code to be injected */
        var code = [
            'var d = document.createElement("div");',
            'd.setAttribute("style", "'
            + 'background-color: red; '
            + 'width: 100px; '
            + 'height: 100px; '
            + 'position: fixed; '
            + 'top: 70px; '
            + 'left: 30px; '
            + 'z-index: 9999; '
            + '");',
            'document.body.appendChild(d);'
        ].join("\n");

        /* Inject the code into the current tab */
        //chrome.tabs.executeScript(tab.id, { code: code });

        chrome.tabs.sendMessage(tab.id, { text: "report_back" }, function(response) {
            console.log(response);
        });

    }
});
