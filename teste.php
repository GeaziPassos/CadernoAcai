<?php
require_once "repositorios/MaquinaRepositorio.php";
require_once "classes/Maquina.php";

require_once "classes/Colaborador.php";
require_once "repositorios/ColaboradorRepositorio.php";

require_once "classes/EscalaMaquina.php";
require_once "repositorios/EscalaMaquinaRepositorio.php";

require_once "classes/Produto.php";
require_once "repositorios/ProdutoRepositorio.php";

require_once "classes/Dupla.php";
require_once "repositorios/DuplaRepositorio.php";

//$repEscalaMaquina = new EscalaMaquinaRepositorio();
//$escalaMaquina = new EscalaMaquina(1, 2);
//$repEscalaMaquina->salvar($escalaMaquina);

//$repColaborador = new ColaboradorRepositorio();
//$repDupla = new DuplaRepositorio();

//$dupla = new Dupla(0, 0, 1);
//$repDupla->salvar($dupla);

//$dupla = $repDupla->buscarPorId(0);
//$colaborador1 = $repColaborador->buscarPorId($dupla->getColaborador1Id());
//echo "A dupla " . $dupla->getId() . " é formada por " . $colaborador1->getNome();


$repProduto = new ProdutoRepositorio();
$produto = new Produto(1, '10kg','Caixa', 3);
$repProduto->salvar($produto);