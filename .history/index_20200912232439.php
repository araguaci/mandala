<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">
	<head>
        <title>✠</title>
        <link rel="stylesheet" type="text/css" href="./css/component.css" />
        <link rel="stylesheet" href="./css/form5-offcanvas.min.css">
        <link rel="stylesheet" href="./css/normalize.css">
        <link rel="stylesheet" href="./css/style.css">
        <script src="./js/jquery.min.js"></script>
        <script src="./js/form5-offcanvas.min.js"></script>
        <script src="./js/modernizr.custom.js"></script>
        <script>
            $(document).ready(function () {
                var _intervalId;
                function fadeInLastImg() {
                    var backImg = $('.container img:first');
                    backImg.hide();
                    backImg.remove();
                    $('.container').append(backImg);
                    backImg.fadeIn()
                }
                ;
                _intervalId = setInterval(function () {
                    fadeInLastImg();
                }, 3);
                $('offcanvas').offcanvas({
                    canvas: ['main', '.toggle-canvas']
                });
            });
        </script>	
    </head>
    <body>
    <?php
    //include_once './menu.php';
    ?>
    <script src="js/jquery.youtubebackground.js"></script>
    <script>
        jQuery(function($) {

            $('#module-video').YTPlayer({
                fitToBackground: false,
                videoId: 'nF0s0kMHS4g',
                pauseOnScroll: false,
                playerVars: {
                    modestbranding: 0,
                    autoplay: 1,
                    controls: 1,
                    showinfo: 0,
                    wmode: 'transparent',
                    branding: 0,
                    rel: 0,
                    autohide: 0,
                    origin: window.location.origin
                }
            });

        });
    </script>

    <div id="module-video" class="module-video"></div>                                 
</body>
</html>