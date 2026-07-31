<?php
class Maquina {
    private int $id;
    private string $produtora;
    private string $linha;

    public function __construct(int $id, string $produtora, string $linha) {
        $this->id = $id;
        $this->produtora = $produtora;
        $this->linha = $linha;
    }

    public function toArray() {
        $array = [
            "id" => $this->id,
            "produtora" => $this->produtora,
            "linha" => $this->linha,
        ];

        return $array;
    }

    // Getters
    public function getId() {
        return $this->id;
    }

    public function getProdutora() {
        return $this->produtora;
    }

    public function getLinha() {
        return $this->linha;
    }

    // Setters
    public function setId(int $id) {
        $this->id = $id;
    }

    public function setProdutora(string $produtora) {
        $this->produtora = $produtora;
    }

    public function setLinha(string $linha) {
        $this->linha = $linha;
    }

}