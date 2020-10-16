<?php ?>
<offcanvas>
    <ul>
        <li><a class="gn-icon gn-icon-pictures" href="../chakra/">All Chakras</a></li>
        <li><a class="gn-icon gn-icon-pictures" href="../poweranimal/">Animal Power</a></li>
        <li><a class="gn-icon gn-icon-pictures" href="../atitude/">Atitude</a></li>
        <li><a class="gn-icon gn-icon-pictures" href="../calma/">Calma</a></li>
        <li><a class="gn-icon gn-icon-pictures" href="../concentre/">Concentre Alfa</a></li>
        <li><a class="gn-icon gn-icon-pictures" href="../concentreb">Concentre Beta</a></li>
        <li><a class="gn-icon gn-icon-pictures" href="../esperanca/">Core Chakra</a></li>
        <li><a class="gn-icon gn-icon-pictures" href="../cropcircle/">Crop Circle</a></li>
        <li><a class="gn-icon gn-icon-pictures" href="../cura/">Cura</a></li>
        <li><a class="gn-icon gn-icon-pictures" href="../empatia/">Empatia</a></li>
        <li><a class="gn-icon gn-icon-pictures" href="../esperanca/">Esperança</a></li>
        <li><a class="gn-icon gn-icon-pictures" href="../johnpaulpolks/">John Paul Polks</a></li>
        <li><a class="gn-icon gn-icon-pictures" href="../geometria/">Geometria Sagrada</a></li>
        <li><a class="gn-icon gn-icon-pictures" href="../calma/">Love Chakras</a></li>
        <li><a class="gn-icon gn-icon-pictures" href="../mandalas/">Mandalas</a></li>
        <li><a class="gn-icon gn-icon-pictures" href="../sacred/">Sacred</a></li>
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
