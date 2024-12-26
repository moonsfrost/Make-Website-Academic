
async function channelCheck(){
    var chs=document.querySelectorAll(".tag-link");
    var banChannel=await chrome.storage.local.get("ban");
    banChannel=banChannel["ban"];
    console.log(banChannel);
    for(let ch of chs) for(let ban of banChannel){
        if(ch.innerText===ban){
            document.body.style.display="none";
            setTimeout(()=>{
                let input=prompt("如需访问请输入\"YeS\"(区分大小写)");
                if(input==="YeS") document.body.style.display="block";
            },300);
            break;
        }
    }
}

channelCheck();
