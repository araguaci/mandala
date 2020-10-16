<?php
    // Affichage de la liste des dossiers non énumérés plus haut ( = projets ).
    $list_ignore = array('.', '..');
    $handle = opendir("./images/.");
    $cnt = 0;
    while ($file = readdir($handle)) {
        $cnt++;
        if (substr($file, -3)==="") {
            if (!in_array($file, $list_ignore)) {
                //shell_exec('magick.exe ' . $file . str_replace('png', ' jpg', $file));
                echo $file . ' => ' . str_replace('png', 'jpg', $file) . ' </br>';
            }
        }
    }
    closedir($handle);
?>