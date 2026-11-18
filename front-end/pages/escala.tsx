import { useState, useEffect } from 'react';
import Sidebar from '../components/sidebar.js';
import Topbar from '../components/topbar.js';

interface Maquina {
  id: number;
  linha: number;
  tag: string;
  ativo: boolean;
}

export default function Escala() {
  const [maquinas, setMaquinas] = useState<Maquina[]>([]);

  useEffect(() => {
    async function buscarMaquinas() {
        const resposta = await fetch('http://localhost:3006/maquinas');
        const dados = await resposta.json();
        setMaquinas(dados);
    }

    buscarMaquinas();
  }, []);

  return (
    <>
      <Sidebar />
      <main className="conteudo">
        <div className="tabela-escala">
            {maquinas.map((maq) => (
                <div key={maq.id}>
                  <div className="maquina-container">
                <p>Tag: {maq.tag} - Linha: {maq.linha}</p>
              </div>
          </div>
            ))}
        </div>
      </main>
    </>
  );
}