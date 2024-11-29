const mainPageUrl="https://www.bilibili.com/";
const searchPageUrl="https://search.bilibili.com/";

async function GetCurrentTab() {
    let nowRequirment={active: true, lastFocusedWindow: true};
    let [tab] =await chrome.tabs.query(nowRequirment);
    return tab;
}

chrome.scripting.registerContentScripts([{
    id: "mainPageProcesser",
    js: ["scripts/listMaker.js","scripts/mainPageProcesser.js"],
    matches: [mainPageUrl],
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

async function mainPageAcademic(tab){
    chrome.scripting.insertCSS({
        files: ["/css/headerShield.css","/css/mainPageAca.css","css/list.css"],
        target: {tabId: tab.id}
    })
}

async function searchPageAcademic(tab){
    chrome.scripting.insertCSS({
        css: "#bili-header-container{display: none !important;}",
        target: {tabId: tab.id}
    })
}

chrome.tabs.onUpdated.addListener(async (tabid,obeject,tab) =>{
    console.log(tab.url);
    if(tab.url===mainPageUrl) mainPageAcademic(tab);
    else if(tab.url.startsWith(searchPageUrl)) searchPageAcademic(tab);
})

chrome.runtime.onInstalled.addListener(()=>{
    chrome.storage.local.clear().then(()=>{
        chrome.storage.local.set({["lists"]:[]});
    })
})