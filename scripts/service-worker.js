async function GetCurrentTab() {
    let nowRequirment={active: true, lastFocusedWindow: true};
    let [tab] =await chrome.tabs.query(nowRequirment);
    return tab;
}

chrome.scripting.registerContentScripts([{
    id: "mainPageProcesser",
    js: ["scripts/mainPageProcesser.js"],
    matches: ["https://www.bilibili.com/"],
    persistAcrossSessions: false,
    runAt: "document_end"
}])
.then(() => {console.log("success!");})
.catch((err) => {console.warn("ERR",err)});


async function simpleInsertCSS(tab) {
    await chrome.scripting.insertCSS({
        files: ["/css/shieldChannelBar.css"],
        target: {tabId: tab.id}
    })
}

chrome.action.onClicked.addListener(async (tab) => {
    await chrome.scripting.removeCSS({
        files: ["/css/testClear.css"],
        target: {tabId: tab.id}
    })
})  

var flag=0;

chrome.tabs.onUpdated.addListener(async (tabid,obeject,tab) =>{
    if(flag==false) await chrome.scripting.insertCSS({
        files: ["/css/MPFastSheild.css"],
        target: {tabId: tabid}
    })
    flag=true;
})

