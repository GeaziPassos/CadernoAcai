import Sidebar from "./../components/sidebar.js"
import Topbar from "./../components/topbar.js"

import {useState} from "react";
import {useEffect} from "react";
import "../pessoas/site.css"

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
    const [filtroTag, setFiltroTag] = useState("");
    const [filtroLinha, setFiltroLinha] = useState<number | undefined>();
    const [maquina, setMaquina] = useState<Maquina>();

    async function carregarMaquinas(){
        const resposta = await fetch("http://localhost:3006/maquinas")

        const dados: Maquina[] = await resposta.json();

        setMaquinas(dados);
    }

    async function editarMaquina(event: React.FormEvent<HTMLFormElement>, maquina: Maquina) {
        event.preventDefault();
        const editar = await fetch("http://localhost:3006/maquinas/update", {
            method: "PUT",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({maquina: maquina})
        })

        setMaquina(undefined);
        await carregarMaquinas();

    }

    async function alterarEstadoMaquina(maquina: Maquina) {

        if(maquina.ativo) {
            const alterarEstado = await fetch("http://localhost:3006/maquinas/deactivate", {
                method: "PATCH",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({id: maquina.id})
            })
        }else {
            const alterarEstado = await fetch("http://localhost:3006/maquinas/reactivate", {
                method: "PATCH",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({id: maquina.id})
            })
        }
        carregarMaquinas();
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
    
    const maquinasFiltradasStatus = maquinas.filter((maquina) => {
        if (filtroStatus === "ativos"){
            return maquina.ativo === true;
        }  

        if(filtroStatus === "inativos"){
            return maquina.ativo === false;
        }

        return true;
    })

    const maquinasFiltradasTag = maquinasFiltradasStatus.filter((maquina) => {
        if(maquina.tag.toLowerCase().includes(filtroTag.toLowerCase())){
            return true;
        }

        return false
    })

    const maquinasFiltradasLinha = maquinasFiltradasTag.filter((maquina) => {
        if(filtroLinha === 0){
            setFiltroLinha(undefined);
        }

        if(filtroLinha === undefined){
            return true
        }

        if(maquina.linha === filtroLinha){
            return true;
        }
        
    })

    return(
        <>
            <Sidebar/>
            
            <main className="conteudo">

                <section className="pagina">        

                    <div className="titulo-pagina">
                        <h2>Máquinas</h2>

                        <button onClick={()=> setModalAberto(true)} className="btn-cadastrar">
                            + Nova Máquina
                        </button>

                        {modalAberto && (
                            <dialog open>

                                <h2>Cadastrar Máquina</h2>

                                <form onSubmit={cadastrarMaquina}>

                                    <label htmlFor="linha">Linha:</label>

                                    <input
                                    type="number"
                                    id="linha"
                                    value={linha}
                                    onChange={(e) => setLinha(e.target.value)}
                                    required
                                    />

                                    <label htmlFor="Tag">Tag:</label>
                                    
                                    <input
                                    type="text"
                                    id="tag"
                                    value={tag}
                                    onChange={(e) => setTag(e.target.value)}
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

                        <div className="tabela-container">

                            <table>
                                <thead>
                                    <tr>
                                        <th>
                                            Linha
                                            <input
                                                type="search"
                                                className="barra-pesquisa"
                                                placeholder="Buscar por linha..."
                                                value = {filtroLinha}
                                                onChange={(e) => setFiltroLinha(Number(e.target.value))}
                                            />
                                        </th>
                                        
                                        <th>
                                            TAG
                                            <input
                                                type="search"
                                                className="barra-pesquisa"
                                                placeholder="Buscar por tag..."
                                                value = {filtroTag}
                                                onChange={(e) => setFiltroTag(e.target.value)}
                                             />
                                        </th>
                                        
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
                                    {maquinasFiltradasLinha.map((maquina) => (
                                        <tr key={maquina.id}>

                                            <td>{maquina.linha}</td>

                                            <td>{maquina.tag}</td>

                                            <td>{maquina.ativo ? "Ativo" : "Inativo"}</td>

                                            <td>
                                                <button onClick={() => alterarEstadoMaquina(maquina)}>{maquina.ativo ? "Desativar" : "Ativar"}</button>
                                            </td>

                                            <td>
                                                <button onClick={() => setMaquina(maquina)}>Editar</button>
                                            </td>
                                            
                                        </tr>
                                    ))}
                                </tbody>

                            </table>

                            {maquina && (
                                <dialog open>
                                    <h2>Editar Máquina</h2>

                                <form onSubmit={(e) => editarMaquina(e, maquina)}>

                                    <label htmlFor="linha">Linha:</label>
                                    
                                    <input
                                    type="number"
                                    id="linha"
                                    value={maquina.linha}
                                    onChange={(e) => setMaquina({
                                        ...maquina,
                                        linha: Number(e.target.value)  
                                     })}
                                     required
                                    />
                                
                                    <label htmlFor="tag">TAG:</label>

                                    <input
                                    type="text"
                                    id="tag"
                                    value={maquina.tag}
                                    onChange={(e) => setMaquina({
                                        ...maquina,
                                        tag: e.target.value
                                    })}
                                    required
                                    />

                                    <button type="submit">Salvar</button>
                                    <button type="button" onClick={() => setMaquina(undefined)}>Cancelar</button>

                                </form>
                                </dialog>

                            )}

                        </div>

                    </div>

                </section>

            </main>
        </>
    )
}

export default Maquinas;