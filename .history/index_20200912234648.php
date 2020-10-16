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
    <iframe width="560" height="315" src="https://www.youtube.com/embed/nF0s0kMHS4g&autoplay=1" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
    <?php
    /*
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
    <style>
        .module-video {
            display: none;
        }
    </style>
    <div id="module-video" class="module-video"></div>

    <script>
        // 2. This code loads the IFrame Player API code asynchronously.
        // https://developers.google.com/youtube/iframe_api_reference
        var tag = document.createElement('script');

        tag.src = "https://www.youtube.com/iframe_api";
        var firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

        // 3. This function creates an <iframe> (and YouTube player)
        //    after the API code downloads.
        var player;
        function onYouTubeIframeAPIReady() {
            player = new YT.Player('player', {
                height: '390',
                width: '640',
                videoId: 'nF0s0kMHS4g',
                    events: {
                    'onReady': onPlayerReady,
                    'onStateChange': onPlayerStateChange
                }
            });
        }

        // 4. The API will call this function when the video player is ready.
        function onPlayerReady(event) {
            event.target.playVideo();
        }

        // 5. The API calls this function when the player's state changes.
        //    The function indicates that when playing a video (state=1),
        //    the player should play for six seconds and then stop.
        var done = false;
        function onPlayerStateChange(event) {
            //if (event.data == YT.PlayerState.PLAYING && !done) {
            //setTimeout(stopVideo, 6000);
            //done = true;
            //}
            event.target.playVideo();
        }
        function stopVideo() {
            player.stopVideo();
        }
        player.playVideo();
    </script>
    <div id="player"></div> 
    */
    ?>
</body>
</html>