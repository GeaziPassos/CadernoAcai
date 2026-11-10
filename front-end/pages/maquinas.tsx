import Sidebar from "./../components/sidebar.js"
import Topbar from "./../components/topbar.js"

import {useState} from "react";
import { useEffect } from "react";
import "./site.css";

interface Maquina{
    id: number;
    linha: number;
    tag: string;
    ativo: boolean
}

function Maquinas() {
    const [modalAberto, setModalAberto] = useState(false);
    const [linha, setLinha] = useState("");
    const [tag, setTag] = useState("");
    const [maquinas, setMaquinas] = useState<Maquina[]>([]);
    const [filtroStatus, setFiltroStatus] = useState("ativos");
    const [filtroLinha, setFiltroLinha] = useState("")
    const [filtroTag, setFiltroTag] = useState("")
    
    async function carregarMaquinas(){
        const resposta = await fetch("http://localhost:3006/pessoas")

        const dados: Maquina[] = await resposta.json();

        setMaquinas(dados);
    }

    async function cadastrarMaquina(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const resposta = await fetch("http://localhost:3006/maquinas", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({tag: tag, linha: linha})
        });

        await carregarMaquinas();

        setLinha("")
        setTag("")
        setModalAberto(false);
    }

    useEffect(() => {
        carregarMaquinas()
    }, []);
    
    const pessoasFiltradasStatus = maquinas.filter((maquina) => {
      if (filtroStatus === "ativos"){
        return maquina.ativo === true;
      }  

      if(filtroStatus === "inativos"){
        return maquina.ativo === false;
      }

      return true;
    })

const pessoasFiltradasNome = pessoasFiltradasStatus.filter((maquina) => {
    if(maquina.tag.toLowerCase().includes(filtroTag.toLowerCase())){
        return true;
    }

    return false
})

    return(
        <>
            <Sidebar/>
            
            <main className="conteudo">
                <Topbar/>

                <section className="pagina">        

                    <div className="titulo-pagina">
                        <h2>Maquinas</h2>

                        <button onClick={()=> setModalAberto(true)} className="btn-cadastrar">
                            + Nova Máquina
                        </button>

                        {modalAberto && (
                            <dialog open>

                                <h2>Cadastrar Máquina</h2>

                                <form onSubmit={cadastrarMaquina}>

                                    <label htmlFor="Linha">Linha:</label>

                                    <input
                                    type="text"
                                    id="linha"
                                    value={linha}
                                    onChange={(e) => setLinha(e.target.value)}
                                    required
                                    />

                                    <input
                                    type="text"
                                    id="tag"
                                    value={tag}
                                    onChange={(e) => setLinha(e.target.value)}
                                    required
                                    />

                                    <button type="submit">
                                        Salvar
                                    </button>

                                    <button type="button" onClick={() => setModalAberto(false)}>
                                        Cancelar
                                    </button>

                                </form>

                            </dialog>
                        )}
                    </div>

                    <div className="painel">

                        <div className="painel-topo">
                                <h3>Equipe</h3>
                        </div>

                        <input
                        type="search" 
                        className="barra-pesquisa"
                        placeholder="Buscar por nome..."
                        value = {filtroNome}
                        onChange={(e) => setFiltroNome(e.target.value)}
                        />

                        <div className="tabela-container">

                            <table>
                                <thead>
                                    <tr>
                                        <th>Nome</th>
                                        <th>Dupla</th>
                                        <th>
                                            Status
                                            <select
                                                value={filtroStatus}
                                                onChange={(e) => setFiltroStatus(e.target.value)}
                                            >
                                                <option value="todos">Todos</option> 
                                                <option value="ativos">Ativos</option> 
                                                <option value="inativos">Inativos</option> 

                                            </select>
                                        </th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {pessoasFiltradasNome.map((pessoa) => (
                                        <tr key={pessoa.id}>

                                            <td>{pessoa.nome}</td>

                                            <td>{/*Dupla futuramente*/}</td>

                                            <td>{pessoa.ativo ? "Ativo" : "Inativo"}</td>
                                            
                                        </tr>
                                    ))}
                                </tbody>

                            </table>

                        </div>

                    </div>

                </section>

            </main>
        </>
    )
}

export default Pessoa;