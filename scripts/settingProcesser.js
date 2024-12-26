function getPos(e){
    var pos=0,fa=e.parentNode;
    var kids=fa.children;
    for(let p of kids){
        if(p===e) return pos;
        pos++;
    }
    return -1;
}
function addBanBar(text){
    var bar=document.createElement("div");
    bar.classList.add("banbar");
    bar.innerHTML=text+"<img class=\"delbaricon\" src=\"../images/no.svg\"/>";
    document.querySelector(".banContainer").appendChild(bar);
    bar.querySelector(".delbaricon").addEventListener("click",(e)=>{
        var pos=e.currentTarget.parentNode;
        chrome.storage.local.get("ban").then((item)=>{
            var arr=item["ban"];
            arr.splice(getPos(pos)-1,1);
            chrome.storage.local.set({ban: arr});
            pos.remove();
        })
    })
}
function banBuild(){
    chrome.storage.local.get("ban").then((item)=>{
        var arr=item["ban"];
        for(let p of arr) addBanBar(p);
    })
}

banBuild();

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

document.querySelector(".newbanBtn").addEventListener("click",()=>{
    var inp=document.querySelector(".newban");
    var text=inp.value;
    inp.value="";
    chrome.storage.local.get("ban").then((item)=>{
        var arr=item["ban"];
        arr.push(text);
        chrome.storage.local.set({ban: arr});
    })
    addBanBar(text);
})