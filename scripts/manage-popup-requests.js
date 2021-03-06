/*
    This script will respond to a datarequest message most times send when opening/reloading the popup.
*/
chrome.runtime.onMessage.addListener(function (request) {
    if (request.cmd === "gibData") {
        let forceReload = request.force_reload || false;
        var query = { active: true, currentWindow: true };
        chrome.tabs.query(query, result => ManageRequestsGotTab(result, forceReload));
    }
    else if (request.cmd === "gibSettings") {
        chrome.runtime.sendMessage({ cmd: "sendSettings", data: SettingsData });
    }
});

function ManageRequestsGotTab(tabData, forceReload) {
    //reformat tabdata
    tabData = tabData[0];
    tabData.url = new URL(tabData.url);

    if (forceReload)
        console.log("FIND-ON-REDDIT: did a forced reload");

    if (!forceReload && Cache.Has(tabData.url)) {
        SendData(Cache.Get(tabData.url));
    }
    else {
        RetrieveDataAboutUrl(tabData, SendData);
    }
}

function SendData(redditData) {
    redditData = JSON.stringify(redditData);
    chrome.runtime.sendMessage({ cmd: "sendData", data: redditData });
}