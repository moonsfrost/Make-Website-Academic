document.querySelector(".updateLimitTime").addEventListener("click",()=>{
    var lim=Number(document.querySelector(".limitTime").value);
    chrome.storage.local.set({limitTime: lim});
    alert("Limit Time has been changed to"+lim);
})

document.querySelector(".fullRecreation").addEventListener("click",()=>{
    chrome.storage.local.set({mode: -1});
    setTimeout(()=>{
        alert("已切换至摆烂模式");
    },500);
})