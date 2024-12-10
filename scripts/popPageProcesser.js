var btn=document.querySelector(".shiftModeButton");
chrome.storage.local.get("mode").then((item)=>{
    var v=item["mode"];
    var btn=document.querySelector(".shiftModeButton");
    btn.setAttribute("statu",v===0?"aca":"rec");
})

btn.addEventListener("click",()=>{
    chrome.storage.local.get("mode").then((item)=>{
        var v=item["mode"];
        v=1^v;
        var btn=document.querySelector(".shiftModeButton");
        btn.setAttribute("statu",v===0?"aca":"rec");
        chrome.storage.local.set({mode: v});
    })
});