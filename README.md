# LightboxeS
![LightboxeS Logo](http://www.snoato.com/stuff/LightboxeS/LightboxeS02Logo.png "LightboxeS Logo")
**LightboxeS** is a simple JavaScript lightbox system, that's made as simple as it can be. Just put your images into a tag with the "lightboxes" class, add the lightboxes.js and the lightboxes.css and it's done. Users can navigate using on screen buttons as well as the arrow keys on the keyboard.

It's that easy.

######Notice: This is an early version, that means the code is ugly and there are minor bugs with some browsers.
#####Tested with: Chrome 43, Safari 8, Internet Explorer 11, Firefox 39, Vavaldi TP4

##Usage
Copy the lightboxes.js and lightboxes.css files and the icons into your project and include them. Add a div with the 'lightboxes' class that surrounds the images you want to have in one 'gallery'. You can, of course, add as many lightboxes as you like. 

####Different image sources for lightbox gallery
If you want to have other image sources used for the lightbox gallery view (for example to use higher resolution images) you can simply add the 'lbs_high_res_src' attribute to your img tags. This is completetly optional and does not require any additional things.

Standard (using the same source for lightbox gallery):
```HTML
<div class="lightboxes">
    <img src="1.JPG">
</div>
```
Optional (using a different source for lightbox gallery):
```HTML
<div class="lightboxes">
    <img src="1.JPG" lbs_high_res_src="1-highres.JPG">
</div>
```

####Preview Gallery
*LightboxeS* gives you the possibility to show a preview gallery at the bottom of your lightbox. To use it you just have to add the 'lbs_previewGallery' attribute to your lightboxes div and set it to true. This again is completely optional.
```HTML
<div class="lightboxes" lbs_previewGallery="true">
    <img src="1.JPG">
</div>
```

####Progress Indicator
You can also add a progress indicator to the bottom of your gallery. Just add the 'lbs_progressIndicator' attribute to your lightboxes div.
```HTML
<div class="lightboxes" lbs_progressIndicator="true">
    <img src="1.JPG">
</div>
```
You can also combine these two attributes so that both a progress bar and a preview gallery are shown.

####Usage notices:
* Be aware that **LightboxeS** adds tags to the images. Keep in mind that all public JS has a 'lbs_' prefix and all CSS ids and classes start with 'lightboxes'.
* You can change the appearance of the buttons by replacing the files. 
* It's recommended to put your JS include after the last use of a lightboxes div, preferably right after the body of your HTML.

##Demo time
###[Live Demo](http://www.snoato.com/lightboxesdemo/ "Live Demo for LightboxeS")
```HTML
<html>
    <head>
        <title>LightboxeS</title>
        <link href="lightboxes.css" type="text/css" rel="stylesheet"><!-- lightboxes css import-->
        <style>
            /*just for the demo, you can do whatever you want to the pictures*/
            .lightboxes img {
                height: 50px;   
            } 
        </style>
    </head>
    
    <body>
        <!-- Standard, this works -->
        <div class="lightboxes">
            <img src="1.JPG">
            <img src="2.JPG">
            <img src="3.JPG">
        </div>
        
        <br>
        
        <!-- With progress bar -->
        <div class="lightboxes" lbs_progressIndicator = "true">
            <img src="4.JPG">
            <img src="5.JPG">
            <img src="6.JPG">
        </div>
        
        <br>
        
        <!-- But you can also put in as many sub divs, etc as you will.
          LightboxeS just grabs the sources from all image tags within a 'lightboxes' class
          You can also add preview galliers, with an simple attribtue-->
        <div class="lightboxes" lbs_previewGallery = "true">
            <div class="someDiv">
                <img src="1.JPG">
                <img src="2.JPG">
            </div>
            <img src="3.JPG">
            <img src="4.JPG">
            <img src="5.JPG">
            <img src="6.JPG">
        </div>
    </body>
    
    <script src="lightboxes.js"></script><!-- lightboxes javascript import -->
</html>
```
That same code would give you something like that:

![LightboxeS GIF Demo](http://www.snoato.com/stuff/LightboxeS/LightboxeSDemo.gif "LightboxeS GIF Demo")

Notice that the second gallery features 3 images although two of them are in an additional div. That's because it grabs all images within a single 'lightboxes' div, keep that in mind. This allows you to be free with your CSS.

##Further development
* Optional image title and description
* *Making it faster on slower browsers*

##Already done
* ~~Rewriting the ugly resizing function~~
* ~~Improvement of the (really ugly) scaling function~~
* ~~Hover effects for icons~~
* ~~Optional preview pics on the bottom~~
* ~~Optional 'progress' bar~~
