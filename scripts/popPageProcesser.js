var btn=document.querySelector(".shiftModeButton");
btn.addEventListener("click",()=>{
    chrome.storage.local.get("mode").then((item)=>{
        var v=item["mode"];
        v=1^v;
        chrome.storage.local.set({mode: v});
    })
});