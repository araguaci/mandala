<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">
    <head>
        <meta charset="UTF-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1"/> 
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/> 
        <title>✠</title>
        <script type="text/javascript" src="js/jquery.min.js"></script>	
        <link rel="stylesheet" type="text/css" href="css/normalize.css" />
        <link rel="stylesheet" type="text/css" href="css/demo.css" />
        <link rel="stylesheet" type="text/css" href="css/component.css" />
        <script src="js/modernizr.custom.js"></script>
        <script type="text/javascript">
            var auto_refresh = setInterval(
                function () {
                    $('#messages').load('messages.php?q='+GetRanom()).fadeIn("slow");
                }, 7000
            ); // refresh every 10000 milliseconds
            function GetRanom() {
                var x = Math.floor((Math.random() * 105) + 1);
                return x;
            }            
/*
            var frame1 = setInterval(
                function () {
                    $("#frame1").attr("src", "https://github.com/search?q=mandala");
                }, 5000
            ); // refresh every 10000 milliseconds
            var frame2 = setInterval(
                function () {
                    $("#frame2").attr("src", "https://twitter.com/hashtag/PrisaoDoAlexandreDeMoraes?src=hashtag_click");
                }, 8000
            ); // refresh every 10000 milliseconds
*/
        </script>
    </head>
    <body>
        <div class='container'>
            <ul id="gn-menu" class="gn-menu-main">
                <li class="gn-trigger" style="width: 5%; min-width: 67px;">
                    <a class="gn-icon gn-icon-menu"><span>Menu</span></a>
                    <nav class="gn-menu-wrapper">
                        <div class="gn-scroller">
                            <ul class="gn-menu">
                                <li><a class="gn-icon gn-icon-pictures" href="./atitude/">Atitude</a></li>
                            </ul>
                        </div><!-- /gn-scroller -->
                    </nav>
                </li>
                <li style="width: 100%; text-align: center; font-size: x-large; font-weight: bolder;"><div id="messages">DEUS SEJA LOUVADO</div></li> 
            </ul>
            <p>
            <iframe id="frame1" src="https://github.com/search?q=mandala" width="100%" height="300"></iframe>
            <iframe id="frame2" src="https://github.com/search?q=meditation" width="100%" height="300"></iframe>
            </p>
        </div>
        <script src="js/classie.js"></script>
        <script src="js/gnmenu.js"></script>
        <script>
            new gnMenu(document.getElementById('gn-menu'));
        </script>

    </body>
</html>