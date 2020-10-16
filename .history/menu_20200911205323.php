<?php ?>
<offcanvas>
    <ul>
        <li><a class="gn-icon gn-icon-cog" href="#" onclick="toggleFullScreen();">Full Screen</a></li>
    </ul>
</offcanvas>
<a href="#toggle-canvas" class="toggle-canvas"><img src="../css/ball_green.png"></a>
<div id="messages" class="toggle-canvas messages">DEUS SEJA LOUVADO</div>
<main>
    <div class='container'>
        <?php
        // Affichage de la liste des dossiers non énumérés plus haut ( = projets ).
        $list_ignore = array('.', '..');
        $handle = opendir("./images/.");
        $cnt = 0;
        while ($file = readdir($handle)) {
            $cnt++;
            if (!in_array($file, $list_ignore)) {
                echo '
      <img src="./images/' . $file . '" alt="">';
            }
        }
        closedir($handle);
        echo $cnt;
        ?>
    </div>    
    <script>
        function toggleFullScreen() {
            if (!document.fullscreenElement && // alternative standard method
                    !document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement) {  // current working methods
                if (document.documentElement.requestFullscreen) {
                    document.documentElement.requestFullscreen();
                } else if (document.documentElement.msRequestFullscreen) {
                    document.documentElement.msRequestFullscreen();
                } else if (document.documentElement.mozRequestFullScreen) {
                    document.documentElement.mozRequestFullScreen();
                } else if (document.documentElement.webkitRequestFullscreen) {
                    document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
                }
            } else {
                if (document.exitFullscreen) {
                    document.exitFullscreen();
                } else if (document.msExitFullscreen) {
                    document.msExitFullscreen();
                } else if (document.mozCancelFullScreen) {
                    document.mozCancelFullScreen();
                } else if (document.webkitExitFullscreen) {
                    document.webkitExitFullscreen();
                }
            }
        }
    </script>
    <script type="text/javascript">
        var auto_refresh = setInterval(
            function () {
                $('#messages').load('../messages.php?q='+GetRanom()).fadeIn("slow");
            }, 3000
        ); // refresh every 10000 milliseconds
        function GetRanom() {
            var x = Math.floor((Math.random() * 105) + 1);
            return x;
        }            
    </script>        
</main>
