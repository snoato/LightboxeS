/*
LightboxeS V 0.1 'Florence'
This file features all JS needed for LightboxeS to work. 
Just add it to your project files and include it at the end of your body.

Created by Daniel Swoboda - @snoato
*/

//number of images in current lightbox
var lbs_imgCounter = 0;
//index of displayed image
var lbs_imgIndex = 0;
//array holding the sources of all images
var lbs_images = null;
///array holding all lightboxes
var lbs_lightboxes = document.getElementsByClassName('lightboxes');

//inits the lightboxes and adds tags needed
function lbs_init() {
    for (var i = 0; i < lbs_lightboxes.length; i++){
        var lbs_pictures = lbs_lightboxes[i].getElementsByTagName('img');
        for(var j=0; j<lbs_pictures.length; j++){
            lbs_pictures[j].addEventListener("click", function(event){
                event.preventDefault();
                lbs_pose(event.target || event.srcElement);
            });
            lbs_pictures[j].setAttribute("lbs_lbx_index", i.toString());
            lbs_pictures[j].setAttribute("lbs_pic_index", j.toString());
        }
    }
}

//Key event listener for keyboard based navigation
function lbs_keyEvent(event){
    switch (event.keyCode) {
    case 37://left arrow key
        lbs_slide("back");
        break;
    case 39://right arrow key
        lbs_slide("forward");
        break;
    case 27://esc key
        lbs_dispose();
        break;
    default:
        return;
    }
}

//removes the lightbox and reinits the images
function lbs_dispose() {
    document.body.removeEventListener("keydown", lbs_keyEvent);//remove key event listener
    
    var lbs_box = document.getElementById("lightboxesBox");
    lbs_box.parentElement.removeChild(lbs_box);  
    lbs_init();
}

//shows a new lightbox starting with the given caller (a lightbox img)
function lbs_pose(caller) {
    //get starting index from clicked image
    var lbs_lightboxindex = parseInt(caller.getAttribute("lbs_lbx_index"));
    
    //add lightbox html
    document.body.innerHTML = document.body.innerHTML + '<div id="lightboxesBox">\n<div id="lightboxesImgWrapper">\n<img class="lightboxesImg" id="lbs_currImg">\n</div>\n<div id="lightboxesLoading"><div id="lightboxesLoadingInner">Loading...</div></div>\n<button class="lightboxesButton" id="lightboxesButtonBack"></button>\n<button class="lightboxesButton" id="lightboxesButtonForward"></button>\n<button id="lightboxesButtonClose" onclick="lbs_dispose();"></button>\n</div>';
    
    //event listener
    document.body.addEventListener("keydown", lbs_keyEvent);//add key event listener
    document.getElementById("lightboxesButtonBack").addEventListener("click", function() {
        lbs_slide("back");
    }); 
    document.getElementById("lightboxesButtonForward").addEventListener("click", function() {
        lbs_slide("forward");
    });
    window.addEventListener("resize", function() {
        lbs_resize(document.getElementById("lbs_currImg"));
    });

    //update global variables
    lbs_imgCounter = lbs_lightboxes[lbs_lightboxindex].getElementsByTagName('img').length;
    lbs_imgIndex = parseInt(caller.getAttribute("lbs_pic_index"));
    lbs_images = lbs_getSource(lbs_lightboxindex);
    
    //check index and hide buttons if needed
    if(lbs_imgIndex == 0) {
        document.getElementById("lightboxesButtonBack").style.display = "none";   
    }
    if(lbs_imgIndex == lbs_imgCounter-1) {
        document.getElementById("lightboxesButtonForward").style.display = "none";   
    }
    
    lbs_swap();
} 

//gets the sources of all images within the given lightbox
function lbs_getSource(lbs_lightboxindex) {
    var lbs_pictures = lbs_lightboxes[lbs_lightboxindex].getElementsByTagName('img');
    var lbs_images = Array();
    for(var i=0; i<lbs_pictures.length; i++){
        var lbs_curr_pic = lbs_pictures[i];
        if(lbs_curr_pic.getAttribute('lbs_high_res_src') == null){
            lbs_images.push(lbs_curr_pic.getAttribute('src'));  
        } else {
            lbs_images.push(lbs_curr_pic.getAttribute('lbs_high_res_src'));
        }
    }
    return lbs_images;
}

//resizes the images in order to fit them perfectly on the screen (maybe too complicated)
function lbs_resize(img) {
    var imgWidth = parseInt(img.width);
    var imgHeight = parseInt(img.height);
    
    var imgWrapper = document.getElementById('lightboxesImgWrapper');

    var w = window,
        d = document,
        e = d.documentElement,
        g = d.getElementsByTagName('body')[0],
        width = parseInt((w.innerWidth || e.clientWidth || g.clientWidth)),
        height = parseInt((w.innerHeight|| e.clientHeight|| g.clientHeight));
    
    var wrapperWidth = width*0.9;
    var wrapperHeight = height*0.9;
    
    if(imgHeight/imgWidth < wrapperHeight/wrapperWidth) {
        img.style.width = "100%";
        img.style.height = "auto";
        img.style.left = "0%";
        img.style.top = ((parseInt(imgWrapper.clientHeight) - parseInt(img.clientHeight))/2)+"px";
    } else {
        img.style.height = "100%";
        img.style.width = "auto";
        img.style.top = "0%";
        img.style.left = ((parseInt(imgWrapper.clientWidth) - parseInt(img.clientWidth))/2)+"px";
    }
}

//slider function used with the buttons, changes displayed image index, calls swap method and corrects buttons
function lbs_slide(direction) {
    document.getElementById("lightboxesLoading").style.display = "block";
    if(direction == "forward" && lbs_imgIndex < lbs_imgCounter-1){
        lbs_imgIndex++;
        if(lbs_imgIndex == lbs_imgCounter-1){
             document.getElementById("lightboxesButtonForward").style.display = "none";
        }
        document.getElementById("lightboxesButtonBack").style.display = "block";
    } else if(direction == "back" && lbs_imgIndex > 0){
        lbs_imgIndex--;
        if(lbs_imgIndex==0){   
            document.getElementById("lightboxesButtonBack").style.display = "none";
        }
        document.getElementById("lightboxesButtonForward").style.display = "block";
    }
    lbs_swap();
}

//swaps the displayed image to the current image
function lbs_swap() {
    document.getElementById("lightboxesImgWrapper").innerHTML = '<img src="'+lbs_images[lbs_imgIndex]+'" class="lightboxesImg" id="lbs_currImg">';
    document.getElementById("lbs_currImg").addEventListener("load", function(){
        lbs_resize(document.getElementById("lbs_currImg"));
        document.getElementById("lightboxesLoading").style.display = "none";
    });  
}

//original init
lbs_init();
