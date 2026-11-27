import Sidebar from "../components/sidebar.js"
import Topbar from "../components/topbar.js"
import { gerarRelatorioAtividades } from "../relatorios/gerarRelatorioAtividades.js";

import {useState} from "react";
import {useEffect} from "react";
import "../pessoas/site.css";

interface Pessoa{
    id: number;
    nome: string;
    ativo: boolean
}

//Falta terminar
interface Dupla{
    id: number;
    pessoa_id_1: number;
    pessoa_id_2: number;
}

function Pessoas() {
    const [modalAberto, setModalAberto] = useState(false);
    const [nome, setNome] = useState("");
    const [pessoas, setPessoas] = useState<Pessoa[]>([]);
    const [filtroStatus, setFiltroStatus] = useState("ativos");
    const [filtroNome, setFiltroNome] = useState("")
    const [ordem, setOrdem] = useState<"asc" | "desc">("asc");
    const [pessoa, setPessoa] = useState<Pessoa>();
    
    async function carregarPessoas(){
        const resposta = await fetch(`http://localhost:3006/pessoas?ordem=${ordem}`);

        const dados: Pessoa[] = await resposta.json();

        setPessoas(dados);
    }

    async function cadastrarPessoa(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const resposta = await fetch("http://localhost:3006/pessoas", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({nome: nome})
        });

        await carregarPessoas();

        setNome("")
        setModalAberto(false);
    }

    async function editarPessoa(event: React.FormEvent<HTMLFormElement>, pessoa: Pessoa) {

        event.preventDefault();
        const resposta = await fetch("http://localhost:3006/pessoas/update", {
            method: "PUT",
            headers: {"Content-type": "application/json"},
            body: JSON.stringify({pessoa: pessoa})
        })
        console.log("estou aquio iaaaaaa")
        
        setPessoa(undefined);
        await carregarPessoas();
    }

    useEffect(() => {
        carregarPessoas()
    }, []);
    
    const pessoasFiltradasStatus = pessoas.filter((pessoa) => {
        if (filtroStatus === "ativos"){
            return pessoa.ativo === true;
        }  

        if(filtroStatus === "inativos"){
            return pessoa.ativo === false;
        }

        return true;
    })

    const pessoasFiltradasNome = pessoasFiltradasStatus.filter((pessoa) => {
        if(pessoa.nome.toLowerCase().includes(filtroNome.toLowerCase())){
            return true;
        }

    return false
    })

    async function alterarStatusPessoa(pessoa: Pessoa) {
        if(pessoa.ativo){
            await fetch("http://localhost:3006/pessoas/desativar", {
                method: "PATCH",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({id: pessoa.id})
            });
        }else{
            await fetch("http://localhost:3006/pessoas/reativar", {
                method: "PATCH",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({id: pessoa.id})
            });
        }

        await carregarPessoas();
    }


    const [dataInicio, setDataInicio] = useState(() => {
        const hoje = new Date();
        return `${hoje.getFullYear()}-${String(hoje.getMonth() + 1).padStart(2, "0")}-01`;
    });

    const [dataFim, setDataFim] = useState(() => {
        const hoje = new Date();
        return `${hoje.getFullYear()}-${String(hoje.getMonth() + 1).padStart(2, "0")}-${String(hoje.getDate()).padStart(2, "0")}`;
    });

    const [gerandoRelatorio, setGerandoRelatorio] = useState(false);


    async function gerarRelatorio() {
        if (dataInicio > dataFim) {
            alert("A data inicial não pode ser maior que a data final.");
            return;
        }

        setGerandoRelatorio(true);

        try {
            const [respostaAtividades, respostaRodizio] = await Promise.all([
                fetch(
                    `http://localhost:3006/relatorios/atividades?inicio=${dataInicio}&fim=${dataFim}`
                ),
                fetch(
                    `http://localhost:3006/relatorios/rodizio?data=${dataFim}`
                )
            ]);

            if (!respostaAtividades.ok || !respostaRodizio.ok) {
                throw new Error("Erro ao buscar dados dos relatórios.");
            }

            const atividades = await respostaAtividades.json();
            const rodizio = await respostaRodizio.json();

            gerarRelatorioAtividades({
                atividades: atividades.atividades,
                alertas: atividades.alertas,
                rodizio,
                inicio: dataInicio,
                fim: dataFim
            });

        } catch (erro) {
            console.error("Erro ao gerar relatório:", erro);
            alert("Não foi possível gerar o relatório.");
        } finally {
            setGerandoRelatorio(false);
        }
    }


    useEffect(() => {
        carregarPessoas();
    }, [ordem]);

    return(
        <>
            <Sidebar/>
            
            <main className="conteudo">

                <section className="pagina">        

                    <div className="titulo-pagina">
                        <h2>Pessoas</h2>

                        <button onClick={()=> setModalAberto(true)} className="btn-cadastrar">
                            + Nova Pessoa
                        </button>

                        {modalAberto && (
                            <dialog open>

                                <h2>Cadastrar Pessoa</h2>

                                <form onSubmit={cadastrarPessoa}>

                                    <label htmlFor="nome">Nome:</label>

                                    <input
                                    type="text"
                                    id="nome"
                                    value={nome}
                                    onChange={(e) => setNome(e.target.value)}
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
                                            <button onClick={() => setOrdem(ordem === "asc" ? "desc" : "asc")}>
                                                {ordem === "asc" ? "A → Z" : "Z → A"}
                                            </button>
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

                                            <td>
                                                <button 
                                                    onClick={() => alterarStatusPessoa(pessoa)}>
                                                    {pessoa.ativo ? "Desativar" : "Ativar"}
                                                </button>
                                            </td>
                                            
                                            <td>
                                                <button onClick={() => setPessoa(pessoa)}>
                                                Editar
                                                </button>

                                            </td>

                                        </tr>
                                    ))}
                                </tbody>

                            </table>

                                    {pessoa && (
                                        <dialog open>

                                            <h2>Editar Pessoa</h2>

                                            <form onSubmit={(event) => editarPessoa(event, pessoa)}>

                                                <label htmlFor="nomeEditar">Nome:</label>

                                                <input
                                                type="text" 
                                                id="nomeEditar"
                                                value={pessoa.nome}
                                                onChange={(e) => setPessoa({
                                                    ...pessoa,
                                                    nome: e.target.value
                                                })}
                                                required
                                                />

                                                <button type="submit">Salvar</button>

                                                <button type="button" onClick={() => setPessoa(undefined)}>Cancelar</button>
                                           
                                            </form>

                                        </dialog>
                                    )}

                        </div>

                    </div>

                </section>

                <div className="painel-relatorios">

                    <h3>Relatório de atividades e rodízio</h3>

                    <div className="filtros-relatorio">

                        <div>
                            <label htmlFor="dataInicio">Data inicial</label>
                            <input
                                type="date"
                                id="dataInicio"
                                value={dataInicio}
                                onChange={(e) => setDataInicio(e.target.value)}
                            />
                        </div>

                        <div>
                            <label htmlFor="dataFim">Data final</label>
                            <input
                                type="date"
                                id="dataFim"
                                value={dataFim}
                                onChange={(e) => setDataFim(e.target.value)}
                            />
                        </div>

                        <button
                            onClick={gerarRelatorio}
                            disabled={gerandoRelatorio}
                        >
                            {gerandoRelatorio
                                ? "Gerando..."
                                : "Gerar relatório PDF"}
                        </button>

                    </div>

                </div>

            </main>
        </>
    )
}

export default Pessoas;