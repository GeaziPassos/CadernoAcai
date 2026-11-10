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
    const [filtroTag, setFiltroTag] = useState("")
    const [filtroLinha, setFiltroLinha] = useState<number | undefined>()

    async function carregarMaquinas(){
        const resposta = await fetch("http://localhost:3006/maquinas")

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
                <Topbar/>

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

                                    <label htmlFor="Linha">Linha:</label>

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

                        <div className="painel-topo">
                                <h3>Equipe</h3>
                        </div>

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

export default Maquinas;