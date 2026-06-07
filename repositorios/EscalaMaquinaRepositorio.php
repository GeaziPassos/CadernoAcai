<?php
require_once __DIR__ . "/../classes/EscalaMaquina.php";

class EscalaMaquinaRepositorio {
    private string $arquivo = __DIR__ . "/../jsons/escalaMaquinas.json";

    private function lerArquivo(): array{
        if (!file_exists($this->arquivo)) {
            return [];
        }
        $conteudo = file_get_contents($this->arquivo);
        return json_decode($conteudo, true) ?? [];
    }

    private function salvarArquivo(array $dados): void {
        file_put_contents($this->arquivo, json_encode($dados, JSON_PRETTY_PRINT));
    }

    public function salvar(EscalaMaquina $escalaMaquina): void{
        $dados = $this->lerArquivo();
        $dados[] = [
            "id" => $escalaMaquina->getId(),
            "maquina" => $escalaMaquina->getMaquina(),
            "produto" => $escalaMaquina->getProduto(),
            "colaboradores" => $escalaMaquina->getColaboradores(),
        ];
        $this->salvarArquivo($dados);
    }

    public function buscarTodos(): array {
        $dados = $this->lerArquivo();
        $escalaMaquinas = [];
        foreach ($dados as $item) {
            $escalaMaquina = new EscalaMaquina($item["id"], $item["maquina"], $item["produto"], $item["colaboradores"]);
            $escalaMaquinas[] = $escalaMaquina;
        }
        return $escalaMaquinas;
    }

    public function buscarPorId(int $id): ?EscalaMaquina {
        $dados = $this->lerArquivo();
        foreach ($dados as $item) {
            if ($item["id"] === $id) {
                return new EscalaMaquina($item["id"], $item["maquina"], $item["produto"], $item["colaboradores"]);
            }
        }
        return null;
    }
                                                                                                                                                                                                                                                                                                                                                
    public function atualizar(EscalaMaquina $escalaMaquina): void {
        $dados = $this->lerArquivo();
        foreach ($dados as $index => $item) {
            if ($item["id"] === $escalaMaquina->getId()) {
                $dados[$index] = [
                    "id" => $escalaMaquina->getId(),
                    "maquina" => $escalaMaquina->getMaquina(),
                    "produto" => $escalaMaquina->getProduto(),
                    "colaboradores" => $escalaMaquina->getColaboradores()
                ];
                break;
            }
        }
        $this->salvarArquivo($dados);
    }

    public function deletar(int $id): void{
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