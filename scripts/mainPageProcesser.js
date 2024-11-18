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

removeMainBody();