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
  nome: String,
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
  
 const carregarNameList = () => {
   const nomeOptions = [];
   
   for (const pessoa of pessoas) {
     let nomeOption = {value: pessoa.nome, label: pessoa.nome};
     nomeOptions.push(nomeOption)
  }

  return nomeOptions;
}

const carregarProdutosList = () => {
  const produtoOptions = [];

  for(const produto of produtos) {
    const produtoOption = {value: produto.nome, label: produto.nome}

    produtoOptions.push(produtoOption);
  }

  return produtoOptions;
}

const selectProdutosComponent = () => (
  <Select options={carregarProdutosList()}/>
)

const selectNomesComponent = () => (
    <Select isMulti options={carregarNameList()} />
)
  
  return (
    <>
      <Sidebar />
      <main className="conteudo">
        <div className="tabela-escala">

            {maquinas.map((maq) => (
              <div className="maquina-container" key={maq.id}>
                <p>{maq.linha}</p>
                <div className='nomes-list'>{selectNomesComponent()}</div>
                <div className='nomes-list'>{selectProdutosComponent()}</div>
              </div>

            ))}

        </div>
      </main>
    </>
  );
}