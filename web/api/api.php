<?php
header("Content-Type: application/json");

require_once __DIR__ . "/../../classes/Produto.php";
require_once __DIR__ . "/../../repositorios/ProdutoRepositorio.php";

$produtoRep = new ProdutoRepositorio();

$dados = json_encode($produtoRep->buscarTodos(), JSON_PRETTY_PRINT);

echo $dados;