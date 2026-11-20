<?php
/**
 * Compatibilidade para servidores PHP que priorizam index.php.
 * Toda a aplicação agora é estática (HTML5 + ES Modules + Web Audio API).
 */
readfile(__DIR__ . '/index.html');
