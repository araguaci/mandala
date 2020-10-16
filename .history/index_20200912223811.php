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
        <script>
            jQuery(function($) {
                $('#background-video').YTPlayer({
                    fitToBackground: true,
                    videoId: 'nF0s0kMHS4g',
                    pauseOnScroll: true,
                    callback: function() {
                    var player = $('#background-video').data('ytPlayer').player;
                    console.log("callback", player);
                    }
                });

            });
        </script>
    </head>
    <body>
    <?php
    include_once './menu.php';
    ?>
    <div id="background-video" class="background-video loaded">
        <iframe id="YTPlayer-ID-nF0s0kMHS4g" class="ytplayer-player" style="display: none;" frameborder="0" allowfullscreen="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" title="YouTube video player" width="1343" height="756" src=""></iframe>
    </div>                                    
</body>
</html>