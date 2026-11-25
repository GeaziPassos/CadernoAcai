import { useState, useEffect } from 'react';
import Sidebar from '../components/sidebar.js';
import Topbar from '../components/topbar.js';
import React from "react";
import Select from "react-select"

interface Maquina {
  id: number;
  linha: number;
  tag: string;
  ativo: boolean;
}

interface Pessoa {
  id: number,
  nome: string,
  ativo: boolean
}

interface Produto {
  id: number,
  nome: string,
  ativo: boolean
}

export default function Escala() {
  const [maquinas, setMaquinas] = useState<Maquina[]>([]);
  const [pessoas, setPessoas] = useState<Pessoa[]>([]);
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [selecionados, setSelecionado] = useState<{
    [maquinaId: number]: {
      pessoas: number[]
      produto: number | null;
    }
  }>({})

  
  useEffect(() => {
    async function buscarMaquinas() {
      const resposta = await fetch('http://localhost:3006/maquinas');
      const dados = await resposta.json();
      setMaquinas(dados);
    }

    buscarMaquinas();
  }, []);
  
  useEffect(() => {
    async function buscarProdutos() {
      const resposta = await fetch('http://localhost:3006/produtos');
      const dados = await resposta.json();
      setProdutos(dados);
    }

    buscarProdutos();
  }, []);
  
  useEffect(() => {
    async function buscarPessoas() {
      const resposta = await fetch('http://localhost:3006/pessoas');
      const dados = await resposta.json();
      setPessoas(dados);
    }
    
    buscarPessoas();
  }, []);
  
 const pessoasOptions = () => {
   const pessoasOptions = [];
   
   for (const pessoa of pessoas) {
    if(pessoa.ativo){
      let nomeOption = {value: pessoa.id, label: pessoa.nome};
      pessoasOptions.push(nomeOption)
    }
  }

  return pessoasOptions;
}

const produtosOptions = () => {
  const produtoOptions = [];

  for(const produto of produtos) {
    if(produto.ativo){

      const produtoOption = {value: produto.id, label: produto.nome}
      
      produtoOptions.push(produtoOption);
    }
  }

  return produtoOptions;
}
  
  return (
    <>
      <Sidebar />
      <main className="conteudo">
        <div className="tabela-escala">

            {maquinas.map((maq) => (
              <div className="maquina-container" key={maq.id}>
                <p>{maq.linha}</p>
                <div className='nomes-list'>{}</div>

                <Select className='nomes-list'
                  isMulti
                  options={pessoasOptions()}
                  
                  value={pessoasOptions().filter((pessoa) => selecionados[maq.id]?.pessoas.includes(pessoa.value,))}

                  onChange={(opcoes) => {
                    setSelecionado({
                      ...selecionados,
                      [maq.id]: {
                        pessoas: opcoes.map((opcao) => opcao.value),
                        produto: selecionados[maq.id]?.produto ?? null
                      }
                    });
                  }}
                  />

                <Select className='produtos-list'
                  options={produtosOptions()}
                />
              </div>

            ))}

            <div className='lista-pessoas-escala'></div>
            {pessoas
              .filter((pessoa) => pessoa.ativo)
              .map((pessoa) => (
                <div
                  className={`pessoa-slot ${
                    Object.values(selecionados).some((maquina) =>
                      maquina.pessoas.includes(pessoa.id)
                    )
                      ? 'pessoa-slot-ocupada'
                      : 'pessoa-slot-livre'
                  }`}
                  key={pessoa.id}
                >
                  <p>{pessoa.nome}</p>
                </div>
              ))}

        </div>
      </main>
    </>
  );
}