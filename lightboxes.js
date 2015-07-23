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
//index of the current lightbox
var lbs_lightboxindex = 0;
//to determine wether a preview has to be shown or not
var lbs_previewMode;
//to determine wether a progess bar has to be shown or not
var lbs_progressMode;
//to dtermine wether infobox is activated or not
var lbs_infoboxMode;
//to determine wether infobox is currently displayed or not 
var lbs_infoboxShowing;
//to determine wether alternative high res image source mode is active or not
var lbs_altHighResSourceMode;


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
    case 38:
        if(lbs_infoboxMode){
            if(!lbs_infoboxShowing){
                document.getElementById("lightboxesImageInfoSlider").className = "lightboxesImageInfoSliderTilt";  
                lbs_infoboxShowing = true;
            }
            lbs_infoboxVisibility();
        }  
        break;
    case 40:
        if(lbs_infoboxMode){
            if(lbs_infoboxShowing){
                document.getElementById("lightboxesImageInfoSlider").className = "";
                lbs_infoboxShowing = false;
            }
            lbs_infoboxVisibility();
        }     
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
    lbs_lightboxindex = parseInt(caller.getAttribute("lbs_lbx_index"));
    var lbs_currLightbox = lbs_lightboxes[lbs_lightboxindex];
    
    //add lightbox html
    document.body.innerHTML = document.body.innerHTML + '<div id="lightboxesBox">\n'
        + '<div id="lightboxesImgWrapper">\n'
        + ' <img class="lightboxesImg" id="lbs_currImg">\n'
        + '</div>\n'
        + ' <div id="lightboxesLoading">\n'
        + ' <div id="lightboxesLoadingInner">Loading...</div>\n'
        + '</div>\n'
        + '<button class="lightboxesButton" id="lightboxesButtonBack"></button>\n'
        + '<button class="lightboxesButton" id="lightboxesButtonForward"></button>\n'
        + '<button id="lightboxesButtonClose" onmousedown="lbs_dispose();"></button>\n'
        + '<div id="lightboxesPreviewGallery"></div>'
        + '<div id="lightboxesProgressBar">'
        + ' <div id="lightboxesProgressBarIndicator"></div>'
        + '</div>'
        + '<div id="lightboxesImageInfo">'
        + ' <div id="lightboxesImageInfoSlider"></div>'
        + ' <div id="lightboxesImageInfoText">'
        + '     <div id="lightboxesImageInfoHeadline"></div>'
        + '     <div id="lightboxesImageInfoSize"></div>'
        + '     <div id="lightboxesImageInfoDescr"></div>'
        + ' </div>'
        + '</div>'
        + '</div>';
    
    //check if the preview attribute is set and preparing chosen preview/progress mode
    var lbs_progressIndicator = lbs_currLightbox.getAttribute('lbs_progressIndicator');
    var lbs_previewGallery = lbs_currLightbox.getAttribute('lbs_previewGallery');
    var lbs_lightbox = document.getElementById("lightboxesBox");
    if(lbs_previewGallery == 'true'){
        lbs_previewMode = true;
        document.getElementById('lightboxesImgWrapper').style.height = "calc(90% - 60px)";
        document.getElementById('lightboxesPreviewGallery').style.display = "block";
    } else {
        lbs_previewMode = false;
        document.getElementById('lightboxesPreviewGallery').style.display = "none";
    }
    if(lbs_progressIndicator == 'true') {
        lbs_progressMode = true;
        if( lbs_previewMode){
            document.getElementById('lightboxesImgWrapper').style.height = "calc(90% - 70px)";
            document.getElementById('lightboxesPreviewGallery').style.bottom = "10px";
        }
        document.getElementById('lightboxesProgressBar').style.display = "block";
    } else {
        lbs_progressMode = false;
        document.getElementById('lightboxesProgressBar').style.display = "none";
    }
    
    
    //checks and initialization for info box
    var lbs_infoBox = lbs_currLightbox.getAttribute('lbs_infoBox');
    if(lbs_infoBox == 'true'){
        lbs_infoboxMode = true;
        document.getElementById("lightboxesImageInfoSlider").addEventListener("click", lbs_infoBoxClickEventListener);
        lbs_infoboxShowing = false;
        lbs_infoboxVisibility();
        
    } else {
        lbs_infoboxMode = false;
        document.getElementById("lightboxesImageInfo").style.display = "none";
    }
    
    if(lbs_currLightbox.getAttribute("lbs_altHighResSourceMode") == 'true'){
        lbs_altHighResSourceMode = true;
    } else {
        lbs_altHighResSourceMode = false;
    }
    
    //event listener
    document.body.addEventListener("keydown", lbs_keyEvent);//add key event listener
    document.getElementById("lightboxesButtonBack").addEventListener("mousedown", function() {
        lbs_slide("back");
    }); 
    document.getElementById("lightboxesButtonForward").addEventListener("mousedown", function() {
        lbs_slide("forward");
    });
    window.addEventListener("resize", function() {
        lbs_resize(document.getElementById("lbs_currImg"));
        if(lbs_previewMode){
            lbs_preview();
        }
        if(lbs_infoboxMode){
            lbs_infoboxVisibility();   
        }
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
function lbs_getSource() {
    var lbs_pictures = lbs_lightboxes[lbs_lightboxindex].getElementsByTagName('img');
    var lbs_images = Array();
    for(var i=0; i<lbs_pictures.length; i++){
        var lbs_curr_pic = lbs_pictures[i];
        if(lbs_altHighResSourceMode){
            if(lbs_curr_pic.parentElement.tagName == 'A'){
                var lbs_source = lbs_curr_pic.parentElement.getAttribute('href');
                if(lbs_source != null && lbs_source != ""){    
                    lbs_images.push(lbs_source); 
                } else {
                    lbs_images.push(lbs_curr_pic.getAttribute('src'));  
                }
            } else {
                lbs_images.push(lbs_curr_pic.getAttribute('src'));  
            }
        } else {
            if(lbs_curr_pic.getAttribute('lbs_high_res_src') == null){
                lbs_images.push(lbs_curr_pic.getAttribute('src'));  
            } else {
                lbs_images.push(lbs_curr_pic.getAttribute('lbs_high_res_src'));
            }
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
    
    var wrapperWidth = parseInt(imgWrapper.clientWidth);
    var wrapperHeight = parseInt(imgWrapper.clientHeight);
    
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
        
    } else if(direction == "back" && lbs_imgIndex > 0){
        lbs_imgIndex--;
        
    }
    lbs_swap();
}

//swaps the displayed image to the current image
function lbs_swap() {
    
    if(lbs_imgIndex == lbs_imgCounter-1){
        document.getElementById("lightboxesButtonForward").style.display = "none";
    } else {
        document.getElementById("lightboxesButtonForward").style.display = "block";
    }
    if(lbs_imgIndex==0){   
        document.getElementById("lightboxesButtonBack").style.display = "none";
    } else {
        document.getElementById("lightboxesButtonBack").style.display = "block";
    }
    
    document.getElementById("lightboxesImgWrapper").innerHTML = '<img src="'+lbs_images[lbs_imgIndex]+'" class="lightboxesImg" id="lbs_currImg">';
    document.getElementById("lbs_currImg").addEventListener("load", function(){
        lbs_resize(document.getElementById("lbs_currImg"));
        document.getElementById("lightboxesLoading").style.display = "none";
    });  
    
    if(lbs_previewMode){
        lbs_preview();
    }
    if(lbs_progressMode){
        document.getElementById('lightboxesProgressBarIndicator').style.width = ((lbs_imgIndex+1)*100)/lbs_imgCounter + "%";
    }
    if(lbs_infoboxMode){
        lbs_infoboxDataUpdate();
        lbs_infoboxVisibility();
    }
}

//generates a set of preview images for easier navgiation
function lbs_preview(){
    var lbs_previewGallery = document.getElementById('lightboxesPreviewGallery');
    lbs_previewGallery.innerHTML = "";
    
    var lbs_prGalWidth = lbs_previewGallery.clientWidth;

    var lbs_previewImages = "";
    for(var i=0; i<lbs_images.length; i++){       
        var leftPosition = (lbs_prGalWidth/2 - 30) - ((lbs_imgIndex - i)*60);
        if(i == lbs_imgIndex){
            lbs_previewImages += "<div  class='lightboxesPreviewImage lightboxesPreviewImageHighlight' style='background-image: url("+lbs_images[i]+"); left: "+leftPosition+"px'></div>";
        } else {
            lbs_previewImages += "<div class='lightboxesPreviewImage' style='background-image: url("+lbs_images[i]+"); left: "+leftPosition+"px' onclick='lbs_preview_swap("+i+")'></div>";
        }
    }
    lbs_previewGallery.innerHTML = "<div id='lightboxesPreviewGalleryInner'>"+lbs_previewImages+"</div>";   
}

//swap function used when a preview image is selected
function lbs_preview_swap(lbs_swapIndex){
    lbs_imgIndex = lbs_swapIndex;
    lbs_swap();
}

//event listener for click on infobox
 function lbs_infoBoxClickEventListener(){     
    if(lbs_infoboxShowing){
        document.getElementById("lightboxesImageInfoSlider").className = "";
        lbs_infoboxShowing = false;
    } else {
        document.getElementById("lightboxesImageInfoSlider").className = "lightboxesImageInfoSliderTilt";  
        lbs_infoboxShowing = true;
    }
    lbs_infoboxVisibility();
}

//handles the shift of all elements according to the infobox visibility
function lbs_infoboxVisibility(){
    var lbs_infoBox_height = document.getElementById("lightboxesImageInfoText").clientHeight;
    if(lbs_infoboxShowing){
        if(lbs_previewMode && lbs_progressMode){
            document.getElementById('lightboxesImgWrapper').style.height = "calc(90% - "+(90+lbs_infoBox_height)+"px)";
            document.getElementById('lightboxesPreviewGallery').style.bottom = (30+lbs_infoBox_height)+"px";
            document.getElementById('lightboxesProgressBar').style.bottom = (20+lbs_infoBox_height)+"px";
        }else if(lbs_progressMode){
            document.getElementById('lightboxesImgWrapper').style.height = "calc(90% - "+(30+lbs_infoBox_height)+"px)";
            document.getElementById('lightboxesProgressBar').style.bottom = (20+lbs_infoBox_height)+"px";
        }else if(lbs_previewMode){
            document.getElementById('lightboxesImgWrapper').style.height = "calc(90% - "+(80+lbs_infoBox_height)+"px)";
            document.getElementById('lightboxesPreviewGallery').style.bottom = (20+lbs_infoBox_height)+"px";
        }
        
        document.getElementById("lightboxesImageInfo").style.bottom = "0px";
    } else {
        if(lbs_previewMode && lbs_progressMode){
            document.getElementById('lightboxesImgWrapper').style.height = "calc(90% - "+(90)+"px)";
            document.getElementById('lightboxesPreviewGallery').style.bottom = (30)+"px";
            document.getElementById('lightboxesProgressBar').style.bottom = (20)+"px";
        }else if(lbs_progressMode){
            document.getElementById('lightboxesImgWrapper').style.height = "calc(90% - "+(30)+"px)";
            document.getElementById('lightboxesProgressBar').style.bottom = (20)+"px";
        }else if(lbs_previewMode){
            document.getElementById('lightboxesImgWrapper').style.height = "calc(90% - "+(80)+"px)";
            document.getElementById('lightboxesPreviewGallery').style.bottom = (20)+"px";
        }
        document.getElementById("lightboxesImageInfo").style.bottom = -lbs_infoBox_height+"px";
    }
}

//reads in the data from the currently displayed picture and fills the infobox with it
function lbs_infoboxDataUpdate(){
    var lbs_currPic = lbs_lightboxes[lbs_lightboxindex].getElementsByTagName('img')[lbs_imgIndex];
    if(lbs_currPic.getAttribute("lbs_infoboxTitle") != null){
        document.getElementById("lightboxesImageInfoHeadline").innerHTML = lbs_currPic.getAttribute("lbs_infoboxTitle");
    } else {
        document.getElementById("lightboxesImageInfoHeadline").innerHTML = lbs_currPic.getAttribute("src");
    }
    
    if(lbs_currPic.getAttribute("lbs_infoboxDesc") != null){
        document.getElementById("lightboxesImageInfoDescr").innerHTML = lbs_currPic.getAttribute("lbs_infoboxDesc");
    } else if(lbs_currPic.getAttribute("alt") != null){
        document.getElementById("lightboxesImageInfoDescr").innerHTML = lbs_currPic.getAttribute("alt");
    } else {
        document.getElementById("lightboxesImageInfoDescr").innerHTML = "";
    }
    
    var lbs_imageObject = new Image();
    lbs_imageObject.src = lbs_images[lbs_imgIndex];
    document.getElementById("lightboxesImageInfoSize").innerHTML =  lbs_imageObject.width+"x"+lbs_imageObject.height;
}

//original init
lbs_init();
