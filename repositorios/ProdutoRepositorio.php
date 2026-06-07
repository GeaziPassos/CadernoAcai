<?php
require_once __DIR__ . "/../classes/Produto.php";

class ProdutoRepositorio {
    private string $arquivo = __DIR__ . "/../jsons/produtos.json";

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

    public function salvar(Produto $produto): void {
        $dados = $this->lerArquivo();
        $dados[] = [
            "id" => $produto->getId(),
            "nome" => $produto->getNome(),
            "tipo" => $produto->getTipo(),
            "quantidadeColaboradores" => $produto->getQuantidadeColaboradores(),
        ];
        $this->salvarArquivo($dados);
    }

    public function buscarTodos(): array {
        $dados = $this->lerArquivo();
        $produtos = [];
        foreach ($dados as $item) {
            $produto = new Produto($item["id"], $item["nome"], $item["tipo"], $item["quantidadeColaboradores"]);
            $produtos[] = $produto;
        }
        return $produtos;
    }

    public function buscarPorId(int $id): ?Produto {
        $dados = $this->lerArquivo();
        foreach ($dados as $item) {
            if ($item["id"] === $id) {
                return new Produto($item["id"], $item["nome"], $item["tipo"], $item["quantidadeColaboradores"]);
            }
        }
        return null;
    }

    public function atualizar(Produto $produto): void {
        $dados = $this->lerArquivo();
        foreach ($dados as $index => $item) {
            if ($item["id"] === $produto->getId()) {
                $dados[$index] = [
                    "id" => $produto->getId(),
                    "nome"=> $produto->getNome(),
                    "tipo" => $produto->getTipo(),
                    "quantidadeColaboradores" => $produto->getQuantidadeColaboradores(),
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