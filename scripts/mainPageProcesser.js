function removeMainBody(){
    needDelete=["bili-feed4-layout","header-channel",
                "bili-header__banner","adblock-tips",
                "right-entry","left-entry",
                "bili-header__channel","palette-button-outer palette-feed4"]
    for(cname of needDelete){
        let del=document.getElementsByClassName(cname);
        for(i of del) i.remove();  
    }
}
async function removePlaceHolder(){
    setTimeout(() => {
        let del=document.getElementsByClassName("nav-search-input");
        for(j of del) j.setAttribute("placeholder",""),j.setAttribute("title","");
    }, 1000);
}

removeMainBody();
removePlaceHolder();

function addListContainer(){
    var container=document.createElement("div");
    container.classList.add("listContainer");
    document.body.appendChild(container);
}

function addList(){
    var p=document.createElement("div");
    p.classList.add("list");
    var listTitle=document.createElement("p");
    listTitle.innerHTML="test title";
    p.appendChild(listTitle);
    document.querySelector(".listContainer").appendChild(p);
}

function addPart(fa){
    var p = document.createElement("div");
    p.classList.add("part");
    p.innerHTML="<span class=\"partText\">are you ok?</span>";
    fa.appendChild(p);
}

addListContainer();
addList();
addList();
addPart(document.querySelector(".list"));