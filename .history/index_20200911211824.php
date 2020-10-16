<?php
    // Affichage de la liste des dossiers non énumérés plus haut ( = projets ).
    $list_ignore = array('.', '..');
    $handle = opendir("./images/.");
    $cnt = 0;
    while ($file = readdir($handle)) {
        $cnt++;
        if (substr($file, -3)==="png") {
            if (!in_array($file, $list_ignore)) {
                $out = shell_exec('magick.exe ' . $file . str_replace('png', 'jpg', $file));
                //echo $file . ' => ' . str_replace('png', 'jpg', $file) . ' </br>';
                echo $out . " => $file " .  "<br/>";
            }
        }
    }
    closedir($handle);
?>