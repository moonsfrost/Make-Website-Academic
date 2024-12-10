function buildLittleF(){
    var getcss=document.createElement("link");
    getcss.rel="stylesheet",getcss.href=chrome.runtime.getURL("css/littleFunction.css");
    document.head.appendChild(getcss);
    var box=document.createElement("div");
    box.classList.add("littleFunctionBox");
    document.body.appendChild(box);
    return box;
}

function historyMake(){
    var his=document.createElement("a");
    hisFile=chrome.runtime.getURL("images/history.svg");
    his.innerHTML="<img src=\""+hisFile+"\" class=\"historyBtn\"/>";
    his.href="#"; //need add url
    LFbox.appendChild(his);
}

var LFbox=buildLittleF();
historyMake();
