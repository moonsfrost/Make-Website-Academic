const imgFIle=chrome.runtime.getURL("images/");
function checkSRC(pos,name){
    return pos.src===imgFIle+name;
}
function getPos(e){
    var pos=0,fa=e.parentNode;
    var kids=fa.children;
    for(let p of kids){
        if(p===e) return pos;
        pos++;
    }
    return -1;
}
function strShift(str){
    if(str.startsWith("[*]")){
        str="<a href=\""+window.location.href+"\">"+str.substring(3)+"</a>";
    }
    else if(str[0]==='['){
        let i=0,r=-1;
        for(let c of str){
            if(c===']'){
                r=i;
                break;
            }
            i++;
        }
        if(r!=-1) str="<a href=\""+str.substring(1,r)+"\">"+str.substring(r+1)+"</a>";
    }
    return str;
}
function strReShift(str){
    if(str.startsWith("<a href=\"")){
        let i=1,l=1;
        for(let c of str){
            if(c==='>'){
                l=i;
                break;
            }
            i++;
        }
        str="["+str.substring(9,i-2)+"]"+str.substring(l,str.length-4);
    }
    return str;
}
async function changePartValue(p,str){
    var temp=await chrome.storage.local.get(p.parentNode.id);
    var obj=temp[p.parentNode.id];
    obj[getPos(p)]=str;
    chrome.storage.local.set({[p.parentNode.id]:obj});
}

function addListContainer(){
    var container=document.createElement("div");
    container.classList.add("listContainer");
    var ti=document.createElement("p");
    ti.classList.add("containerTitle");
    ti.innerHTML="随时记";
    var ic=document.createElement("img");
    ic.src=imgFIle+"add.svg";
    ic.classList.add("listIcon");
    ti.appendChild(ic);
    container.appendChild(ti);
    document.body.appendChild(container);
    ic.addEventListener("click",()=>{newList()});
    return container;
}

function delPart(e){
    var pos=e.parentNode;
    var parts=pos.parentNode.children;
    var obj={},i=0;
    for(let a of parts){
        if(a===pos) continue;
        alert(a.innerHTML);
        if(a.classList.contains("part")) obj[i]=strReShift(a.querySelector(".partText").innerHTML);
        i++;
    }
    chrome.storage.local.set({[pos.parentNode.id] : obj});
    pos.remove();
}
function addPart(fa,str){
    var p = document.createElement("div");
    p.classList.add("part");
    p.innerHTML="<span class=\"partText\">"+strShift(str)+"</span>";
    fa.appendChild(p);
    return p;
}
function newPart(fa){
    var p=addPart(fa,"[*]");
    beginEditPart(p.children[0]);
}

function finishEditPart(e){ // to finish the edit of the part's text
    var pos=e.parentNode;//pos is the part
    // change input to span
    var tex=pos.querySelector(".newText").value;
    if(this.src===imgFIle+"no.svg"){
        tex=pos.querySelector(".newText").getAttribute("oldvalue");
    }
    pos.innerHTML="<span class=\"partText\">"+strShift(tex)+"</span>";
    changePartValue(pos,strShift(tex));
    //restore the icons
    if(pos.parentNode.getAttribute("editflag")==="off") return;
    for (let i of ["edit.svg","del.svg"]){
        var ic=document.createElement("img");
        ic.src=imgFIle+i;
        ic.classList.add("listIcon");
        pos.appendChild(ic);
        if(i==="edit.svg") ic.addEventListener("click",(e)=>{beginEditPart(e.currentTarget)});
        else if(i==="del.svg") ic.addEventListener("click",(e)=>{delPart(e.currentTarget)});
    }
}

function beginEditPart(e){
    var pos=e.parentNode;

    // change span to input
    var tex=pos.querySelector(".partText").innerHTML;
    pos.innerText="";
    pos.innerHTML="<input type=\"text\" class=\"newText\" value=\""+strReShift(tex)+"\">";
    pos.querySelector(".newText").setAttribute("oldvalue",tex);

    // add icons
    for (let i of ["no.svg","yes.svg"]){
        var ic=document.createElement("img");
        ic.src=imgFIle+i;
        ic.classList.add("listIcon");
        pos.appendChild(ic);
        ic.addEventListener("click",(e)=>{finishEditPart(e.currentTarget)});
    }
    // focus on the right border automatically
    let inp=pos.querySelector(".newText");
    let len=inp.value.length;
    inp.focus();
    inp.setSelectionRange(len,len);
}

function editList(e){
    var temp=e.parentNode;
    var pos=temp.parentNode;
    let parts=pos.querySelectorAll(".part");
    let ti=temp.querySelector("span");

    //to stop the statu of editing part
    let editingparts=pos.querySelectorAll(".newText");
    for(let p of editingparts) finishEditPart(p);

    if(pos.getAttribute("editflag")==="off"){
        let oldTitle=ti.innerHTML;
        ti.innerHTML="<input value=\""+oldTitle+"\"/>";
        for(let p of parts){
            for (let i of ["edit.svg","del.svg"]){
                var ic=document.createElement("img");
                ic.src=imgFIle+i;
                ic.classList.add("listIcon");
                p.appendChild(ic);
                if(i==="edit.svg") ic.addEventListener("click",(e)=>{beginEditPart(e.currentTarget)});
                else if(i==="del.svg") ic.addEventListener("click",(e)=>{delPart(e.currentTarget)});
            }
        }
        pos.setAttribute("editflag","on");
    }
    else{
        let newTitle=ti.querySelector("input").value;
        ti.innerHTML=newTitle;
        chrome.storage.local.get("listTitles").then((item)=>{
            let arr=item["listTitles"];
            arr[getPos(pos)-1]=newTitle;
            chrome.storage.local.set({listTitles: arr});
        })
        for(let p of parts){
            let icons=p.querySelectorAll(".listIcon");
            for(let i of icons) i.remove();
        }
        pos.setAttribute("editflag","off");
    }
}
function newList(){
    chrome.storage.local.get("lists").then((item)=>{
        var ls=item["lists"];
        let str="表"+ls.length;
        ls.push(str);
        chrome.storage.local.set({"lists":ls});
        chrome.storage.local.set({[str]:{}});
        addList(str);
    })
    chrome.storage.local.get("listTitles").then((item)=>{
        var ls=item["listTitles"];
        let str="表"+ls.length;
        ls.push(str);
        chrome.storage.local.set({"listTitles":ls});
    })
}

function addList(str){
    var list=document.createElement("div");
    list.classList.add("list");
    list.id=str;

    var listTitle=document.createElement("p");
    listTitle.classList.add("listName");
    listTitle.innerHTML="<span>"+str+"</span>";

    list.appendChild(listTitle);
    list.setAttribute("editflag","off");
    document.querySelector(".listContainer").appendChild(list);

    for(let i of ["add.svg","edit.svg"] ){
        var ic=document.createElement("img");
        ic.src=imgFIle+i;
        ic.classList.add("listIcon");
        listTitle.appendChild(ic);
        if(i==="edit.svg") ic.addEventListener("click",(e)=>{editList(e.currentTarget)});
        else if(i==="add.svg") ic.addEventListener("click",(e)=>{newPart(e.currentTarget.parentNode.parentNode)});
    }

    return list;
}

function toggleHide(e){
    var pos=e.parentNode;

}

async function buildList(){
    var cter=addListContainer();
    if(window.location.href.startsWith("https://www.bilibili.com/video")){
        cter.classList.add("videoStatu");
    }
    var tot=await chrome.storage.local.get("lists");
    var tts=await chrome.storage.local.get("listTitles");
    // alert(tot["lists"]);
    for(i=0;i<tot["lists"].length;i++){
        let tit=tot["lists"][i];
        let tt=tts["listTitles"][i];
        var pos=addList(tt);
        var temp=await chrome.storage.local.get(tit);
        var parts=Object.values(temp[tit]);
        for(let p of parts) addPart(pos,p);
    }
}

buildList();