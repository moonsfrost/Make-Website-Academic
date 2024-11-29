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
        if(r!=-1) str="<a href=\""+str.substring(1,r-1)+"\">"+str.substring(r+1)+"</a>";
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
    ti.innerHTML="随时记";
    var ic=document.createElement("img");
    ic.src=imgFIle+"add.svg";
    ic.classList.add("listIcon");
    ti.appendChild(ic);
    container.appendChild(ti);
    document.body.appendChild(container);
    ic.addEventListener("click",()=>{newList("qwe")});
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

function finishEditPart(){ // to finish the edit of the part's text
    var pos=this.parentNode;//pos is the part
    // change input to span
    var tex=pos.querySelector(".newText").value;
    if(this.src===imgFIle+"no.svg"){
        tex=pos.querySelector(".newText").getAttribute("oldvalue");
    }
    pos.innerHTML="<span class=\"partText\">"+strShift(tex)+"</span>";
    changePartValue(pos,strShift(tex));
    //restore the icons
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
        ic.addEventListener("click",finishEditPart);
    }
    // 
}

function editList(e){
    var temp=e.parentNode;
    var pos=temp.parentNode;
    let parts=pos.querySelectorAll(".part");
    if(pos.getAttribute("editflag")==="off"){
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
        for(let p of parts){
            let icons=p.querySelectorAll(".listIcon");
            for(let i of icons) i.remove();
        }
        pos.setAttribute("editflag","off");
    }
}
function newList(str){
    chrome.storage.local.get("lists").then((item)=>{
        var ls=item["lists"];
        ls.push(str);
        chrome.storage.local.set({"lists":ls});
        chrome.storage.local.set({[str]:{}});
        addList(str);
    })
}

function addList(str){
    var list=document.createElement("div");
    list.classList.add("list");
    list.id=str;

    var listTitle=document.createElement("p");
    listTitle.classList.add("listName");
    listTitle.innerHTML=str;

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

async function buildList(){
    addListContainer();
    var tot=await chrome.storage.local.get("lists");
    // alert(tot["lists"]);
    for(let tit of tot["lists"]){
        var pos=addList(tit);
        var temp=await chrome.storage.local.get(tit);
        var parts=Object.values(temp[tit]);
        for(let p of parts) addPart(pos,p);
    }
}
