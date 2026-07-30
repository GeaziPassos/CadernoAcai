<?php
require_once __DIR__ . "/../classes/Colaborador.php";

class ColaboradorRepositorio {
    private string $arquivo = __DIR__ . "/../jsons/colaboradores.json";

    private function lerArquivo(): array {
        if(!file_exists($this->arquivo)){
            return [];
        }
        $conteudo = file_get_contents($this->arquivo);
        return json_decode($conteudo, true) ?? [];
    }

    private function salvarArquivo(array $dados): void {
        file_put_contents($this->arquivo, json_encode($dados, JSON_PRETTY_PRINT));
    }

    public function salvar(Colaborador $colaborador) {
        $dados = $this->lerArquivo();
        $dados[] = [
            "id" => $colaborador->getId(),
            "nome" => $colaborador->getNome(),
            "bica" => $colaborador->getBica(),
            "fecharCaixa" => $colaborador->getFecharCaixa(),
        ];
        $this->salvarArquivo($dados);
    }

    public function buscarTodos(): array {
        $dados = $this->lerArquivo();
        $colaboradores = [];
        foreach ($dados as $item) {
            $colaborador = new Colaborador($item["id"], $item["nome"], $item["bica"], $item["fecharCaixa"]);
            $colaboradores[] = $colaborador->toArray();
        }
        return $colaboradores;
    }

    public function buscarPorId(int $id): ?Colaborador {
        $dados = $this->lerArquivo();
        foreach ($dados as $item){
            if ($item["id"] === $id){
                return new Colaborador($item["id"], $item["nome"], $item["bica"], $item["fecharCaixa"]);
            }
        }
        return null;
    } 

    public function atualizar(Colaborador $colaborador): void {
        $dados = $this->lerArquivo();
        foreach ($dados as $index => $item) {
            if ($item["id"] === $colaborador->getId()) {
                $dados[$index] = [
                    "id" => $colaborador->getId(),
                    "nome" => $colaborador->getNome(),
                    "bica" => $colaborador->getBica(),
                    "fecharCaixa" => $colaborador->getFecharCaixa(),
                ];
                break;
            }
        }
        $this->salvarArquivo($dados);
    }

    public function deletar(int $id): void {
        $dados = $this->lerArquivo();
        foreach ($dados as $index => $item) {
            if ($item["id"] === $id) {
                unset($dados[$index]);
                break;
            }
        }
        $dados = array_values($dados);
        $this->salvarArquivo($dados);
    }
}