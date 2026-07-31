<?php
header("Content-type: application/json");

require_once __DIR__ . "/../../repositorios/MaquinaRepositorio.php";

$maquinaRep = new MaquinaRepositorio();

$dados = json_encode($maquinaRep->buscarTodos(), JSON_PRETTY_PRINT);

echo $dados;