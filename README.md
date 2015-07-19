# LightboxeS
![LightboxeS Logo](http://www.snoato.com/stuff/LightboxeS/LightboxeS01Logo.png "LightboxeS Logo")
######Notice: This is an early version, that means the code is ugly and there are (minor) bugs (especially when it comes to event based resizement) with some browsers.
#####Tested with: Chrome 43, Safari 8, Internet Explorer 11, Firefox 39, Vavaldi TP4
**LightboxeS** is a simple JavaScript lightbox system, that's made as simple as it can be. Just put your images into a tag with the "lightboxes" class, add the lightboxes.js and the lightboxes.css and it's done. Users can navigate using on screen buttons as well as the arrow keys on the keyboard.

It's that easy.

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

Usage notices:
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
        
        <!-- But you can also put in as many sub divs, etc as you will.
          LightboxeS just grabs the sources from all image tags within a 'lightboxes' class-->
        <div class="lightboxes">
            <div class="someDiv">
                <img src="4.JPG">
                <img src="5.JPG">
            </div>
            <img src="6.JPG">
        </div>
    </body>
    
    <script src="lightboxes.js"></script><!-- lightboxes javascript import -->
</html>
```
That same code would give you something like that:

![LightboxeS GIF Demo](http://www.snoato.com/stuff/LightboxeS/LightboxeSDemo.gif "LightboxeS GIF Demo")

Notice that the second gallery features 3 images although two of them are in an additional div. That's because it grabs all images within a single 'lightboxes' div, keep that in mind. This allows you to be free with your CSS.

##Further Development
* Improvement of the (really ugly) scaling function
* Adding previews in the bottom
* Making it faster on slower browsers
* Giving the opportunity for higher resolution image links
