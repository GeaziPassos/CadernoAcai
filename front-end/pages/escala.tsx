import "./escala.css";

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


function separarData(data: string): [number, number, number] {
  const partes = data.split("-");

  return [
    Number(partes[0]),
    Number(partes[1]),
    Number(partes[2])
  ];
}

function formatarData(data: string) {
  const [ano, mes, dia] = data.split("-");
  return `${dia}/${mes}/${ano}`;
}

function obterDiaSemana(data: string) {
  const [ano, mes, dia] = separarData(data);

  return new Date(ano, mes - 1, dia).toLocaleDateString("pt-BR", {
    weekday: "long"
  });
}

function alterarData(data: string, quantidade: number) {
  const [ano, mes, dia] = separarData(data);

  const novaData = new Date(ano, mes - 1, dia);
  novaData.setDate(novaData.getDate() + quantidade);

  const anoNovo = novaData.getFullYear();
  const mesNovo = String(novaData.getMonth() + 1).padStart(2, "0");
  const diaNovo = String(novaData.getDate()).padStart(2, "0");

  return `${anoNovo}-${mesNovo}-${diaNovo}`;
}



export default function Escala() {


  const [dataEscala, setDataEscala] = useState(() => {
    const hoje = new Date();
    return `${hoje.getFullYear()}-${String(hoje.getMonth() + 1).padStart(2, '0')}-${String(hoje.getDate()).padStart(2, '0')}`;
  });

  const [alteracoesNaoSalvas, setAlteracoesNaoSalvas] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [salvoEm, setSalvoEm] = useState<string | null>(null);


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
  async function buscarEscala() {
    setSelecionado({});
    setAlteracoesNaoSalvas(false);
    setSalvoEm(null);

    try {
      const resposta = await fetch(
        `http://localhost:3006/escalas/${dataEscala}`
      );

      if (!resposta.ok) {
        throw new Error("Erro ao buscar escala");
      }

      const dados = await resposta.json();

      const novaSelecao: typeof selecionados = {};

      for (const item of dados.maquinas ?? []) {
        novaSelecao[item.maquinaId] = {
          pessoas: item.pessoas,
          produto: item.produtoId ?? null
        };
      }

      setSelecionado(novaSelecao);

      if (dados.salvoEm) {
        setSalvoEm(
          new Date(dados.salvoEm).toLocaleTimeString("pt-BR", {
            hour: "2-digit",
            minute: "2-digit"
          })
        );
      }

    } catch (erro) {
      console.error("Erro ao carregar escala:", erro);
    }
  }

  buscarEscala();
}, [dataEscala]);


  useEffect(() => {
    async function buscarMaquinas() {
      const resposta = await fetch('http://localhost:3006/maquinas?ordem=asc&ordemPor=linha');
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
  

async function salvarEscala() {
  setSalvando(true);

  try {
    const dadosEscala = {
      maquinas: maquinas.map((maq) => ({
        maquinaId: maq.id,
        pessoas: selecionados[maq.id]?.pessoas ?? [],
        produtoId: selecionados[maq.id]?.produto ?? null
      }))
    };

    const resposta = await fetch(
      `http://localhost:3006/escalas/${dataEscala}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(dadosEscala)
      }
    );

    if (!resposta.ok) {
      throw new Error("Erro ao salvar escala");
    }

    const dados = await resposta.json();

    setAlteracoesNaoSalvas(false);

    setSalvoEm(
      new Date(dados.salvoEm ?? Date.now()).toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit"
      })
    );

  } catch (erro) {
    console.error("Erro ao salvar escala:", erro);
    alert("Não foi possível salvar a escala.");

  } finally {
    setSalvando(false);
  }
}

 const pessoasOptions = (maquinaId: number) => {
  return pessoas
    .filter((pessoa) => {
      if (!pessoa.ativo) return false;

      // Verifica se a pessoa está em alguma outra máquina
      const jaEscalada = Object.entries(selecionados).some(
        ([id, maquina]) =>
          Number(id) !== maquinaId &&
          maquina.pessoas.includes(pessoa.id)
      );

      return !jaEscalada;
    })
    .map((pessoa) => ({
      value: pessoa.id,
      label: pessoa.nome
    }));
};

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
        
        
        <header className="escala-header">

          <div className="header-identificacao">
            <strong>CadernoAçaí</strong>
            <span>·</span>
            <span>Escala</span>
          </div>

          <div className="header-data">

            <button
              className="btn-data"
              onClick={() => {
                if (alteracoesNaoSalvas && !confirm("Existem alterações não salvas. Deseja continuar?")) return;

                setDataEscala(alterarData(dataEscala, -1));
              }}
            >
              ‹
            </button>

            <input
              type="date"
              value={dataEscala}
              onChange={(e) => {
                if (alteracoesNaoSalvas && !confirm("Existem alterações não salvas. Deseja continuar?")) return;

                setDataEscala(e.target.value);
              }}
            />

            <button
              className="btn-data"
              onClick={() => {
                if (alteracoesNaoSalvas && !confirm("Existem alterações não salvas. Deseja continuar?")) return;

                setDataEscala(alterarData(dataEscala, 1));
              }}
            >
              ›
            </button>

            <button
              className="btn-hoje"
              onClick={() => {
                if (alteracoesNaoSalvas && !confirm("Existem alterações não salvas. Deseja continuar?")) return;

                const hoje = new Date();
                const dataHoje = `${hoje.getFullYear()}-${String(hoje.getMonth() + 1).padStart(2, '0')}-${String(hoje.getDate()).padStart(2, '0')}`;

                setDataEscala(dataHoje);
              }}
            >
              Hoje
            </button>

            <span className="dia-semana">
              {obterDiaSemana(dataEscala)}
            </span>

          </div>

          <div className="header-acoes">

            <span className="status-escala">
              {alteracoesNaoSalvas
                ? "Alterações não salvas"
                : salvoEm
                  ? `Salvo às ${salvoEm}`
                  : "Escala carregada"}
            </span>

            <button
              className="btn-salvar"
              disabled={salvando || !alteracoesNaoSalvas}
              onClick={salvarEscala}
            >
              {salvando ? "Salvando..." : "▣ Salvar"}
            </button>

          </div>

        </header>

        
        <div className="tabela-escala">

          <div className="lista-maquinas-escala">

            {maquinas.map((maq) => (
              <div className="maquina-container" key={maq.id}>
                <p>{maq.linha}</p>

                <Select
                  className="nomes-list"
                  isMulti
                  options={pessoasOptions(maq.id)}

                  value={pessoasOptions(maq.id).filter((pessoa) =>
                    selecionados[maq.id]?.pessoas.includes(pessoa.value)
                  )}

                  onChange={(opcoes) => {
                    setSelecionado((anterior) => ({
                      ...anterior,
                      [maq.id]: {
                        pessoas: opcoes.map((opcao) => opcao.value),
                        produto: anterior[maq.id]?.produto ?? null
                      }
                    }));

                    setAlteracoesNaoSalvas(true);
                  }}
                />

                <Select className='produtos-list'
                  options={produtosOptions()}
                  />
              </div>

            ))}
            </div>
            
            <aside className="painel-colaboradores">


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

            </aside>
        </div>
      </main>
    </>
  );
}