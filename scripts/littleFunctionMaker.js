function buildLittleF(){
    var getcss=document.createElement("link");
    getcss.rel="stylesheet",getcss.href=chrome.runtime.getURL("css/littleFunction.css");
    document.head.appendChild(getcss);
    var box=document.createElement("div");
    box.classList.add("littleFunctionBox");
    document.body.appendChild(box);
    return box;
}

function addBtn(file,url){
    var p=document.createElement("a");
    var pFile=chrome.runtime.getURL("images/"+file);
    p.innerHTML="<img src=\""+pFile+"\" class=\"BTN\"/>";
    p.href=url;
    LFbox.appendChild(p);
}

var LFbox=buildLittleF();

addBtn("history.svg","https://www.bilibili.com/account/history");

chrome.storage.local.get("mode").then((item)=>{
    if(item["mode"]===1) addBtn("trend.svg","https://t.bilibili.com/");
})