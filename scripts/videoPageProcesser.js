const banChannel=["游戏"];

function channelCheck(){
    var ch=document.querySelector(".firstchannel-tag");
    for(let ban of banChannel){
        if(ch.innerText===ban){
            document.body.style.display="none";
            setTimeout(()=>{
                let input=prompt("如需访问请输入\"YeS\"(区分大小写)");
                if(input==="YeS") document.body.style.display="block";
            },300);
        }
    }
    
    
    //can add the function to allow users to look those video for a short time
}

channelCheck();
