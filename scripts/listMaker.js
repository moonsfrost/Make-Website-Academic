const imgFIle=chrome.runtime.getURL("images/");
function checkSRC(pos,name){
    return pos.src===imgFIle+name;
}
function strShift(str){
    if(str.startsWith("[*]")) 
        str="<a href=\""+window.location.href+"\">"+str.substring(3)+"</a>";
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
        str="[*]"+str.substring(l,str.length-4);
    }
    return str;
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
    ic.addEventListener("click",()=>{addList("qwe")});
}

function delPart(e){
    var pos=e.parentNode;
    pos.remove();
}

function addPart(fa,str){
    var p = document.createElement("div");
    p.classList.add("part");
    p.innerHTML="<span class=\"partText\">"+strShift(str)+"</span>";
    fa.appendChild(p);
}

function finishEditPart(){ // to finish the edit of the part's text
    var pos=this.parentNode;
    // change input to span
    var tex=pos.querySelector(".newText").value;
    if(this.src===imgFIle+"no.svg"){
        tex=pos.querySelector(".newText").getAttribute("oldvalue");
    }
    pos.innerHTML="<span class=\"partText\">"+strShift(tex)+"</span>";

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

function addList(str){
    var list=document.createElement("div");
    list.classList.add("list");

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
        else if(i==="add.svg") ic.addEventListener("click",(e)=>{addPart(e.currentTarget.parentNode.parentNode,"bac")});//need add
    }

}


