<?php
require_once __DIR__ . "/../classes/Dupla.php";

class DuplaRepositorio {
    private string $arquivo = __DIR__ . "/../jsons/duplas.json";

    private function lerArquivo(): array {
        if (!file_exists($this->arquivo)) {
            return [];
        }
        $conteudo = file_get_contents($this->arquivo);
        return json_decode($conteudo, true) ?? [];
    }

    private function salvarArquivo(array $dados): void {
        file_put_contents($this->arquivo, json_encode($dados, JSON_PRETTY_PRINT));
    }

    public function salvar(Dupla $dupla): void {
        $dados = $this->lerArquivo();
        $dados[] = [
            "id" => $dupla->getId(),
            "colaborador1Id" => $dupla->getColaborador1Id(),
            "colaborador2Id" => $dupla->getColaborador2Id()
        ];
        $this->salvarArquivo($dados);
    }

    public function buscarTodos(): array {
        $dados = $this->lerArquivo();
        $duplas = [];
        foreach ($dados as $item) {
            $dupla = new Dupla($item["id"], $item["colaborador1Id"], $item["colaborador2Id"]);
            $duplas[] = $dupla;
        }
        return $duplas;
    }

    public function buscarPorId(int $id): ?Dupla {
        $dados = $this->lerArquivo();
        foreach ($dados as $item) {
            if ($item["id"] === $id) {
                return new Dupla($item["id"], $item["colaborador1Id"], $item["colaborador2Id"]);
            }
        }
        return null;
    }
    
    
    public function atualizar(Dupla $dupla): void {
        $dados = $this->lerArquivo();
        foreach ($dados as $index => $item) {
            if ($item["id"] === $dupla->getId()) {
                $dados[$index] = [
                    "id" => $dupla->getId(),
                    "colaborador1Id" => $dupla->getColaborador1Id(),
                    "colaborador2Id" => $dupla->getColaborador2Id()
                    ];
                    break;
                    }
                }
            $this->salvarArquivo($dados);
        }

    public function deletar(int $id): void {
        $dados = $this->lerArquivo();
        $novosDados = [];
        foreach ($dados as $item) {
            if ($item["id"] !== $id) {
                $novosDados[] = $item;
            }
        }
        $this->salvarArquivo($novosDados);
    }
}