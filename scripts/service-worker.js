const mainPageUrl="https://www.bilibili.com/";
const searchPageUrl="https://search.bilibili.com/";
const videoPageUrl="https://www.bilibili.com/video/";

async function GetCurrentTab() {
    let nowRequirment={active: true, lastFocusedWindow: true};
    let [tab] =await chrome.tabs.query(nowRequirment);
    return tab;
}

function modeShift(flag){
    if(flag===0){ //Academic mode
        console.log("switch to aca mode");
        // change injected scripts
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
        }]);
        // remove alarms
        chrome.alarms.clear("limitRecreation");
        chrome.storage.local.set({["alarmBeginTime"]: -1});
    }
    else if(flag===1){ // Limited Recreation mode
        console.log("switch to rec mode");
        // change injected scripts
        chrome.scripting.unregisterContentScripts({ids: ["mainPageForAca","videoPageForAca"]});
        // set alarms
        let d=new Date;
        chrome.storage.local.set({alarmBeginTime: d.getTime()});
        chrome.storage.local.get("limitTime").then((item)=>{
            chrome.alarms.create("limitRecreation",{
                delayInMinutes: item.limitTime
            })
        })
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
        if(key==="mode"&&oldValue!==newValue) modeShift(newValue);
    }
})

chrome.runtime.onInstalled.addListener(()=>{
    chrome.storage.local.clear().then(()=>{
        chrome.storage.local.set({["lists"]:[]});
        chrome.storage.local.set({["mode"]: 0});
        chrome.storage.local.set({["alarmBeginTime"]: -1});
        chrome.storage.local.set({["limitTime"]: 1});
    });
    chrome.alarms.clearAll();
})

chrome.alarms.onAlarm.addListener((alm)=>{
    chrome.storage.local.set({["mode"]: 0});
    console.log(alm.name);
})

setTimeout(()=>{},500);
// make sure addListener is the priority

chrome.storage.local.get("mode").then((item)=>{
    console.log(item.mode===0?"aca":"rec");
});
async function recoverAlarm(){
    let item= await chrome.storage.local.get("alarmBeginTime");
    let lim= await chrome.storage.local.get("limitTime");
    lim=lim.limitTime;
    console.log("beginProcess");
    if(item === undefined || item.alarmBeginTime === -1) return;
    chrome.alarms.get("limitRecreation", (alm) =>{
        if(!alm){
            console.log("recovering");
            let d=new Date;
            let now=d.getTime();
            let beg=item.alarmBeginTime;
            let left=Math.floor(beg+lim*60*1000-now);
            if(left<=0) chrome.storage.local.get("mode").then((item)=>{
                if(item.mode===1) chrome.storage.local.set({mode: 0});
            });
            else chrome.alarms.create("limitRecreation",{
                delayInMinutes: left
            });
        }
    })
}
recoverAlarm();