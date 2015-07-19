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

//removes the lightbox and reinits the images
function lbs_dispose() {
    var lbs_box = document.getElementById("lightboxesBox");
    lbs_box.parentElement.removeChild(lbs_box);  
    lbs_init();
}

//shows a new lightbox starting with the given caller (a lightbox img)
function lbs_pose(caller) {
    var lbs_lightboxindex = parseInt(caller.getAttribute("lbs_lbx_index"));


    document.body.innerHTML = document.body.innerHTML + '<div id="lightboxesBox">\n<div id="lightboxesImgWrapper">\n<img class="lightboxesImg" id="lbs_currImg">\n</div>\n<div id="lightboxesLoading"><div id="lightboxesLoadingInner">Loading...</div></div>\n<button class="lightboxesButton" id="lightboxesButtonBack"></button>\n<button class="lightboxesButton" id="lightboxesButtonForward"></button>\n<button id="lightboxesButtonClose" onclick="lbs_dispose();"></button>\n</div>';

    document.getElementById("lightboxesButtonBack").addEventListener("click", function() {
        lbs_slide("back");
    }); 

    document.getElementById("lightboxesButtonForward").addEventListener("click", function() {
        lbs_slide("forward");
    });


    window.addEventListener("resize", function() {
        var img = document.getElementById("lbs_currImg"); 
        lbs_resize(img);
    });

    lbs_imgCounter = lbs_lightboxes[lbs_lightboxindex].getElementsByTagName('img').length;

    lbs_imgIndex = parseInt(caller.getAttribute("lbs_pic_index"));
    lbs_images = lbs_getSource(lbs_lightboxindex);

    lbs_swap();

    if(lbs_imgIndex == 0) {
        document.getElementById("lightboxesButtonBack").style.display = "none";   
    }
    if(lbs_imgIndex == lbs_imgCounter-1) {
        document.getElementById("lightboxesButtonForward").style.display = "none";   
    }
} 

//gets the sources of all images within the given lightbox
function lbs_getSource(lbs_lightboxindex) {
    var lbs_pictures = lbs_lightboxes[lbs_lightboxindex].getElementsByTagName('img');
    var lbs_images = Array();
    for(var i=0; i<lbs_pictures.length; i++){
        lbs_images.push(lbs_pictures[i].getAttribute('src'));
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


    var newWidth = img.style.width;
    var newLeftDist = img.style.left;
    var newHeight = img.style.height;
    var newTopDist = img.style.top;
    if((imgWidth >= (width - width*0.1) && imgHeight <= (height - width*0.1))){
        img.style.width = "100%";
        img.style.left = "0%";
        img.style.height = "auto";
        img.style.top = ((parseInt(imgWrapper.clientHeight) - parseInt(img.clientHeight))/2);
    } else if((imgWidth <= (width - width*0.1) && imgHeight >= (height - width*0.1))){
        img.style.height = "100%";
        img.style.top = "0%";
        img.style.width = "auto";
        img.style.left = ((parseInt(imgWrapper.clientWidth) - parseInt(img.clientWidth))/2);
    } else if((imgWidth <= (width - width*0.1) && imgHeight <= (height - width*0.1))){
        img.style.left = ((parseInt(imgWrapper.clientWidth) - parseInt(img.clientWidth))/2);
        img.style.top = ((parseInt(imgWrapper.clientHeight) - parseInt(img.clientHeight))/2);
    } else {
        if(imgWidth >= imgHeight){
            img.style.width = "100%";
            img.style.left = "0%";
            img.style.height = "auto";
            img.style.top = ((parseInt(imgWrapper.clientHeight) - parseInt(img.clientHeight))/2);
        } else {
            img.style.height = "100%";
            img.style.top = "0%";
            img.style.width = "auto";
            img.style.left = ((parseInt(imgWrapper.clientWidth) - parseInt(img.clientWidth))/2);
        }
    }
}

//slider function used with the buttons, changes displayed image index, calls swap method and corrects buttons
function lbs_slide(direction) {
    document.getElementById("lightboxesLoading").style.display = "block";
    if(direction == "forward"){
        lbs_imgIndex++;
        if(lbs_imgIndex == lbs_imgCounter-1){
             document.getElementById("lightboxesButtonForward").style.display = "none";
        }
        document.getElementById("lightboxesButtonBack").style.display = "block";
    } else if(direction == "back"){
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
        lbs_resize(document.getElementById("lbs_currImg"));
        document.getElementById("lightboxesLoading").style.display = "none";
    });  
}

lbs_init();
