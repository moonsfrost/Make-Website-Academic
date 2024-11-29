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

function setList(){
    addListContainer();
    addList("test1");
    addList("test2");
    addPart(document.querySelector(".list"),"wuhu");
}

buildList();