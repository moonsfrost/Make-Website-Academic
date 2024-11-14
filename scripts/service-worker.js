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

chrome.action.onClicked.addListener(async (tab) => {
    await chrome.scripting.removeCSS({
        files: ["/css/testClear.css"],
        target: {tabId: tab.id}
    })
})  

chrome.tabs.onUpdated.addListener(async (tabid,obeject,tab) =>{
    // await chrome.scripting.insertCSS({
    //     files: ["/css/videoShieldRecommend.css"],
    //     target: {tabId: tabid}
    // })
})

