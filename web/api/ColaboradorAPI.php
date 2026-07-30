<?php
header("Content-Type: application/json");

require_once __DIR__ . "/../../repositorios/ColaboradorRepositorio.php";

$colaboradorRep = new ColaboradorRepositorio();

$dados = json_encode($colaboradorRep->buscarTodos(), JSON_PRETTY_PRINT);

echo $dados;