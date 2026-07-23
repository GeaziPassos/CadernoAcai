<?php 
class Produto {
    private int $id;
    private string $nome;
    private ?string $tipo;
    private ?int $quantidadeColaboradores;

    public function __construct(int $id, string $nome, ?string $tipo, ?int $quantidadeColaboradores) {
        $this->id = $id;
        $this->nome = $nome;
        $this->tipo = $tipo;
        $this->quantidadeColaboradores = $quantidadeColaboradores;
    }

    public function toArray() {
        $array = [
            "id" => $this->id,
            "nome" => $this->nome,
            "tipo" => $this->tipo,
            "quantidadeColaboradores" => $this->quantidadeColaboradores
            ];
        return $array;
    }

    // Getters
    public function getId() {
        return $this->id;
    }

    public function getNome() {
        return $this->nome;
    }

    public function getTipo() {
        return $this->tipo;
    }

    public function getQuantidadeColaboradores() {
        return $this->quantidadeColaboradores;
    }

    // Setters
    public function setId(int $id) {
        $this->id = $id;
    }

    public function setNome(string $nome) {
        $this->nome = $nome;
    }

    public function setTipo(?string $tipo) {
        $this->tipo = $tipo;
    }

    public function setQuantidadeColaboradores(?int $quantidadeColaboradores) {
        $this->quantidadeColaboradores = $quantidadeColaboradores;
    }
    
}