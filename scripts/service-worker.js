const mainPageUrl="https://www.bilibili.com/";
const searchPageUrl="https://search.bilibili.com/";
const videoPageUrl="https://www.bilibili.com/video/";

async function GetCurrentTab() {
    let nowRequirment={active: true, lastFocusedWindow: true};
    let [tab] =await chrome.tabs.query(nowRequirment);
    return tab;
}

function modeShift(flag){
    if(flag===0){
        chrome.scripting.registerContentScripts([{
            id: "mainPageForAca",
            js: ["scripts/listMaker.js","scripts/mainPageProcesser.js"],
            css: ["css/headerShield.css","css/mainPageAca.css","css/list.css"],
            matches: [mainPageUrl],
            persistAcrossSessions: false,
            runAt: "document_end"
        },{
            id: "videoPageForAca",
            js: ["scripts/videoPageProcesser.js"],
            css: ["css/videoShieldRecommend.css"],
            matches: [videoPageUrl+"*"],
            persistAcrossSessions: false,
            runAt: "document_end"
        }])
    }
    else if(flag===1){
        chrome.scripting.unregisterContentScripts({ids: ["mainPageForAca","videoPageForAca"]});
    }
}

async function searchPageAcademic(tab){
    chrome.scripting.insertCSS({
        css: "#bili-header-container{display: none !important;}",
        target: {tabId: tab.id}
    })
}


chrome.storage.onChanged.addListener((chg,area)=>{
    for(let [key,{oldValue, newValue}] of Object.entries(chg)){
        if(key==="mode") modeShift(newValue);
    }
})

chrome.runtime.onInstalled.addListener(()=>{
    chrome.storage.local.clear().then(()=>{
        chrome.storage.local.set({["lists"]:[]});
        chrome.storage.local.set({["mode"]: 0});
    })
})