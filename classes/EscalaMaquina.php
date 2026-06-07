<?php
class EscalaMaquina{

    private int $id;
    private int $maquina;
    private ?int $produto;
    private array $colaboradores; 
    
    public function __construct(int $id, int $maquina, ?int $produto, array $colaboradores = []){
        $this->id = $id;
        $this->maquina = $maquina;
        $this->produto = $produto;
        $this->colaboradores = $colaboradores;
    }

    //Getters
    public function getId() {
        return $this->id;
    }

    public function getMaquina() {
        return $this->maquina;
    }

    public function getColaboradores() {
        return $this->colaboradores;
    }

    public function getProduto() {
        return $this->produto;
    }

    //Setters
    public function setId(int $id) {
        $this->id = $id;
    }

    public function setMaquina(int $idMaquina) {
        $this->maquina = $idMaquina;
    }

    public function setColaborador(int $idColaborador){
        $this->colaboradores[] = $idColaborador;
    }

    public function setProduto(int $idProduto) {
        $this->produto = $idProduto;
    }
}