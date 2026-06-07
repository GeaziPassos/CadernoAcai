<?php
require_once __DIR__ . "/../classes/Maquina.php";

class MaquinaRepositorio {
    private string $arquivo = __DIR__ . "/../jsons/maquinas.json";


    private function lerArquivo(): array {
        if (!file_exists($this->arquivo)){
            return [];
        }
        $conteudo = file_get_contents($this->arquivo);
        return json_decode($conteudo, true) ?? [];
    }

    private function salvarArquivo(array $dados): void {
        file_put_contents($this->arquivo, json_encode($dados, JSON_PRETTY_PRINT));
    }

    public function salvar(Maquina $maquina): void{
        $dados = $this->lerArquivo();
        $dados[] = [
            "id" => $maquina->getId(),
            "produtora" => $maquina->getProdutora(),
            "linha" => $maquina->getLinha(),
        ];
        $this->salvarArquivo($dados);
    }

    public function buscarTodos(): array {
        $dados = $this->lerArquivo();
        $maquinas = [];
        foreach ($dados as $item) {
            $maquina = new Maquina($item["id"], $item["produtora"], $item["linha"]);
            $maquinas[] = $maquina;
        }
        return $maquinas;
    }

    public function buscarPorId(int $id): ?Maquina {
        $dados = $this->lerArquivo();
        foreach($dados as $item) {
            if ($item["id"] === $id) {
                return new Maquina($item["id"], $item["produtora"], $item["linha"]);
            }
        }
        return null;
    }

    public function atualizar(Maquina $maquina): void {
        $dados = $this->lerArquivo();
        foreach ($dados as $index => $item) {
            if ($item["id"] === $maquina->getId()) {
                $dados[$index] = [
                    "id" => $maquina->getId(),
                    "produtora" => $maquina->getProdutora(),
                    "linha" => $maquina->getLinha(),
                ];
                break;
            }
        }
        $this->salvarArquivo($dados);
    }

    public function deletar(int $id) {
        $dados = $this->lerArquivo();
        foreach ($dados as $index => $item) {
            if ($item["id"] === $id) {
                unset($dados[$index]);
                $dados = array_values($dados);
                break;
            }
        }
        $this->salvarArquivo($dados);
    }
}