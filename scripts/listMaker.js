function addListContainer(){
    var container=document.createElement("div");
    container.classList.add("listContainer");
    document.body.appendChild(container);
}

const imgFIle=chrome.runtime.getURL("images/");
function checkSRC(pos,name){
    return pos.src===imgFIle+name;
}


function delPart(e){
    var pos=e.parentNode;
    pos.remove();
}

function finishEditPart(){ // to finish the edit of the part's text
    var pos=this.parentNode;
    // change input to span
    var tex=pos.querySelector(".newText").value;
    if(this.src===imgFIle+"no.svg"){
        tex=pos.querySelector(".newText").getAttribute("oldvalue");
    }
    pos.innerHTML="<span class=\"partText\">"+tex+"</span>";

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
    var tex=pos.querySelector(".partText").textContent;
    pos.innerHTML="<input type=\"text\" class=\"newText\" value=\""+tex+"\">";
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

function addList(){
    var list=document.createElement("div");
    list.classList.add("list");

    var listTitle=document.createElement("p");
    listTitle.classList.add("listName");
    listTitle.innerHTML="test title";

    list.appendChild(listTitle);
    list.setAttribute("editflag","off");
    document.querySelector(".listContainer").appendChild(list);

    for(let i of ["add.svg","edit.svg"] ){
        var ic=document.createElement("img");
        ic.src=imgFIle+i;
        ic.classList.add("listIcon");
        listTitle.appendChild(ic);
        if(i==="edit.svg") ic.addEventListener("click",(e)=>{editList(e.currentTarget)});
        else if(i==="add.svg") {}//need add
    }

}

function addPart(fa){
    var p = document.createElement("div");
    p.classList.add("part");
    p.innerHTML="<span class=\"partText\">are you ok?</span>";
    fa.appendChild(p);
}

