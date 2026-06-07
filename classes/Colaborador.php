<?php
class Colaborador {
    private int $id;
    private string $nome;

    // Funcoes
    private int $bica;
    private int $fecharCaixa;

    public function __construct(int $id, string $nome, int $bica = 0, int $fecharCaixa = 0) {
        $this->id = $id;
        $this->nome =$nome;
        $this->bica = $bica;
        $this->fecharCaixa = $fecharCaixa;
    }

    // Getters
    public function getId() {
        return $this->id;
    }

    public function getNome() {
        return $this->nome;
    }

    public function getBica() {
        return $this->bica;
    }

    public function getFecharCaixa() {
        return $this->fecharCaixa;
    }

    // Setters
    public function setId(int $id) {
        $this->id = $id;
    }

    public function setNome(string $nome) {
        $this->nome = $nome;
    }

    public function setBica(int $bica) {
        $this->bica = $bica;
    }

    public function setFechar(int $fecharCaixa) {
        $this->fechar = $fecharCaixa;
    }

}