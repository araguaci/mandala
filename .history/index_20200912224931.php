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
    include_once './menu.php';
    ?>
    <div id="background-video" style="display: none;">
        <iframe id="YTPlayer-ID-nF0s0kMHS4g" class="ytplayer-player" frameborder="0" allowfullscreen="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" title="YouTube video player" width="1343" height="756" src="https://www.youtube.com/embed/LSmgKRx5pBo?modestbranding=1&amp;autoplay=1&amp;controls=0&amp;showinfo=0&amp;wmode=transparent&amp;branding=0&amp;rel=0&amp;autohide=0&amp;origin=http%3A%2F%2Flocalhost&amp;enablejsapi=1&amp;widgetid=1"></iframe>
    </div>                                    
</body>
</html>