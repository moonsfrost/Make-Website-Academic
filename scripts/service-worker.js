async function GetCurrentTab() {
    let nowRequirment={active: true, lastFocusedWindow: true};
    let [tab] =await chrome.tabs.query(nowRequirment);
    return tab;
}

async function simpleInsertCSS(tab) {
    await chrome.scripting.insertCSS({
        files: ["/css/testClear.css"],
        target: {tabId: tab.id}
    })
}

chrome.action.onClicked.addListener(async () => {
    let tab=await GetCurrentTab();
    await simpleInsertCSS(tab);
})  