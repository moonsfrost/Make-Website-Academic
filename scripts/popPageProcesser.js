var btn=document.querySelector(".shiftModeButton");
chrome.storage.local.get("mode").then((item)=>{
    var v=item["mode"];
    var btn=document.querySelector(".shiftModeButton");
    btn.setAttribute("statu",v===0?"aca":"rec");
})

btn.addEventListener("click",()=>{
    chrome.storage.local.get("mode").then((item)=>{
        var v=item["mode"];
        if(v===0) v=1;
        else v=0;
        var btn=document.querySelector(".shiftModeButton");
        btn.setAttribute("statu",v===0?"aca":"rec");
        chrome.storage.local.set({mode: v});
    })
});