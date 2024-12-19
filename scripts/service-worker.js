const mainPageUrl="https://www.bilibili.com/";
const searchPageUrl="https://search.bilibili.com/";
const videoPageUrl="https://www.bilibili.com/video/";
const trendPageUrl="https://t.bilibili.com/"

function getDateHash(){
    let d = new Date;
    var hash=d.getFullYear*10000+d.getMonth()*100+d.getDate();
    return hash;
}
async function GetCurrentTab() {
    let nowRequirment={active: true, lastFocusedWindow: true};
    let [tab] =await chrome.tabs.query(nowRequirment);
    return tab;
}
async function injectMainFun(){
    let check=await chrome.scripting.getRegisteredContentScripts({ids: ["mainPageForAca"]});
    if(check.length>0) return;
    chrome.scripting.registerContentScripts([{
        id: "mainPageForAca",
        js: ["scripts/listMaker.js","scripts/mainPageProcesser.js","scripts/littleFunctionMaker.js"],
        css: ["css/mainPageAca.css","css/list.css"],
        matches: [mainPageUrl,mainPageUrl+"?spm_id*"],
        persistAcrossSessions: false,
        runAt: "document_end"
    },{
        id: "headShield",
        css: ["css/headerShield.css"],
        matches: [mainPageUrl+"*",searchPageUrl+"*",trendPageUrl+"*"],
        persistAcrossSessions: false,
        runAt: "document_end"
    }]);
}
async function jsShift(flag){
    if(flag===0){// Academic mode
        injectMainFun();
        let check=await chrome.scripting.getRegisteredContentScripts({ids: ["videoPageForAca"]});
        console.log(check);
        if(check.length>0) return;
        chrome.scripting.registerContentScripts([{
            id: "videoPageForAca",
            js: ["scripts/listMaker.js","scripts/videoPageProcesser.js","scripts/littleFunctionMaker.js"],
            css: ["css/list.css"],
            matches: [videoPageUrl+"*"],
            persistAcrossSessions: false,
            runAt: "document_end"
        }]);
        check=await chrome.scripting.getRegisteredContentScripts({ids: ["videoPageForRec"]});
        if(check.length===0) return;
        chrome.scripting.unregisterContentScripts({ids: ["videoPageForRec"]});
    }
    else if(flag===1){
        injectMainFun();
        let check=await chrome.scripting.getRegisteredContentScripts({ids: ["videoPageForRec"]});
        if(check.length>0) return;
        chrome.scripting.registerContentScripts([{
            id: "videoPageForRec",
            js: ["scripts/littleFunctionMaker.js"],
            css: ["css/videoShieldRecommend.css"],
            matches: [videoPageUrl+"*"],
            persistAcrossSessions: false,
            runAt: "document_end"
        }])
        check=await chrome.scripting.getRegisteredContentScripts({ids: ["videoPageForAca"]});
        if(check.length===0) return;
        chrome.scripting.unregisterContentScripts({ids: ["videoPageForAca"]});
    }
    else if(flag===-1){
        var allJS=await chrome.scripting.getRegisteredContentScripts();
        var jsIds=allJS.map(allJS => allJS.id);
        chrome.scripting.unregisterContentScripts({ids: jsIds});
    }
}
function redirectShift(flag){
    if(flag===0){
        chrome.declarativeNetRequest.updateEnabledRulesets({
            enableRulesetIds: ["redirectOtherPage","redirectForAca"]
        })
    }
    else if(flag===1){
        chrome.declarativeNetRequest.updateEnabledRulesets({
            disableRulesetIds: ["redirectForAca"],
            enableRulesetIds: ["redirectOtherPage"]
        })
    }
    else if(flag===-1){
        chrome.declarativeNetRequest.updateEnabledRulesets({
            disableRulesetIds: ["redirectOtherPage","redirectForAca"]
        })
    }
}

function modeShift(flag,alarmNeed){ //alarmNeed is only for when set a new recreation time
    jsShift(flag);
    redirectShift(flag);
    if(flag===0||flag===-1){ //Academic or fullrec mode
        if(flag===0) console.log("switch to aca mode");
        else console.log("switch to full rec mode");

        if(flag===-1) chrome.storage.local.set({fullTime: getDateHash()});
        // remove alarms
        chrome.alarms.clear("limitRecreation");
        chrome.storage.local.set({["alarmBeginTime"]: -1});
    }
    else if(flag===1){ // Limited Recreation mode
        console.log("switch to rec mode");
        // set alarms
        if(alarmNeed===1){
            let d=new Date;
            chrome.storage.local.set({alarmBeginTime: d.getTime()});
            chrome.storage.local.get("limitTime").then((item)=>{
                chrome.alarms.create("limitRecreation",{
                    delayInMinutes: item.limitTime
                }).then(()=>{
                    console.log("the clock is created and the limit time is"+item.limitTime);
                })
            })
        }
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
        if(key==="mode") modeShift(newValue,1);
    }
})

chrome.runtime.onInstalled.addListener(()=>{
    chrome.storage.local.clear().then(()=>{
        chrome.storage.local.set({["lists"]:[]});
        chrome.storage.local.set({["listTitles"]:[]});
        chrome.storage.local.set({["mode"]: 0});
        chrome.storage.local.set({["alarmBeginTime"]: -1});
        chrome.storage.local.set({["limitTime"]: 30});
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
async function recoverStatu(){
    // ensure every last check have a mode setting
    let dateHash=await chrome.storage.local.get("fullTime");
    let code=await chrome.storage.local.get("mode");
    if(code.mode===-1){
        if(dateHash!==getDateHash()) chrome.storage.local.set({mode: -1});
        return;
    }

    let item= await chrome.storage.local.get("alarmBeginTime");
    let lim= await chrome.storage.local.get("limitTime");
    lim=lim.limitTime;
    console.log("beginProcess");
    if(item === undefined || item.alarmBeginTime === -1){
        modeShift(0);
        return;
    }
    let d=new Date;
    let now=d.getTime();
    let beg=item.alarmBeginTime;
    let left=Math.floor(beg+lim*60*1000-now);
    if(left<=-2000) chrome.storage.local.set({mode: 0});
    else modeShift(1);
    chrome.alarms.get("limitRecreation", (alm) =>{
        if(!alm){ // alarm is not exist
            console.log("recovering");
            if(left>0){
                chrome.alarms.create("limitRecreation",{
                    delayInMinutes: left
                });
            }
        }
    })
}
recoverStatu();