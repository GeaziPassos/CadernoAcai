import Sidebar from "../components/sidebar.js";
import Topbar from "../components/topbar.js";
import { gerarRelatorioMensal } from "../relatorios/gerarRelatorioMensal.js";

import {useState} from "react";
import {useEffect} from "react";
import "../pessoas/site.css";

interface Produto{
    id: number;
    nome: string;
    ativo: boolean
}

function Produtos(){
    const [modalAberto, setModalAberto] = useState(false);
    const [nome, setNome] = useState("");
    const [produtos, setProdutos] = useState<Produto[]>([]);
    const [filtroStatus, setFiltroStatus] = useState("ativo");
    const [filtroNome, setFiltroNome] = useState("");
    const [produto, setProduto] = useState<Produto>();
    const [ordem, setOrdem] = useState<"asc" | "desc">("asc")

    const dataAtual = new Date();

    const [mesRelatorio, setMesRelatorio] = useState(dataAtual.getMonth() + 1);
    const [anoRelatorio, setAnoRelatorio] = useState(dataAtual.getFullYear());

    async function gerarRelatorio() {
        try {
            const resposta = await fetch(
                `http://localhost:3006/relatorios/mensal?mes=${mesRelatorio}&ano=${anoRelatorio}`
            );

            if (!resposta.ok) {
                throw new Error("Erro ao buscar os dados do relatório.");
            }

            const dados = await resposta.json();

            gerarRelatorioMensal(dados);

        } catch (erro) {
            console.error("Erro ao gerar relatório mensal:", erro);
            alert("Não foi possível gerar o relatório mensal.");
        }
    }



    async function carregarProdutos(){
        const resposta = await fetch(`http://localhost:3006/produtos?ordem=${ordem}`);
        
        const dados: Produto[] = await resposta.json();

        setProdutos(dados);
    }

    async function cadastrarProduto(event: React.FormEvent<HTMLFormElement>){
        event.preventDefault();

        const reposta = await fetch("http://localhost:3006/produtos", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({nome: nome})
        });

        await carregarProdutos();

        setNome("");
        setModalAberto(false);
    }   

    
    const produtosFiltradosStatus = produtos.filter((produto) => {
        if(filtroStatus === "ativos"){
            return produto.ativo === true;
        }
        
        if(filtroStatus === "inativos"){
            return produto.ativo === false;
        }
        
        return true;
    })
    
    const produtosFiltradoNome = produtosFiltradosStatus.filter((produto) => {
        if(produto.nome.toLowerCase().includes(filtroNome.toLowerCase())){
            return produto;
        }
        
        return false;
    })
    
    async function alterarStatusProduto(produto: Produto) {
        if(produto.ativo) {
            const alterarStatus = await fetch("http://localhost:3006/produtos/deactivate", {
                method: "PATCH",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({id: produto.id})
            })
        }else{
            
            const alterarStatus = await fetch("http://localhost:3006/produtos/reactivate", {
                method: "PATCH",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({id: produto.id})
            })
        }
        
        await carregarProdutos();

        console.log("aqui")
    }

    async function editarProduto(event: React.FormEvent<HTMLFormElement> ,produto: Produto) {
        event.preventDefault;

        const resposta = await fetch("http://localhost:3006/produtos/update", {
            method: "UPDATE",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({dados: produto})
        })
    }
  
    useEffect(() => {
        carregarProdutos();
    }, [ordem]);
    
    return(
        <>
            <Sidebar />

                <main className="conteudo">

                    <section className="pagina">

                        <div className="titulo-pagina">
                            <h2>Produtos</h2>
                            
                            <button onClick={() => setModalAberto(true)} className="btn-cadastrar">
                                + Novo Produto
                            </button>

                            {modalAberto &&(
                                <dialog open>

                                    <h2>Cadastrar Produto</h2>

                                    <form onSubmit={cadastrarProduto}>
                                        
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

                                        <button type="button" onClickCapture={() => setModalAberto(false)}>
                                            Cancelar
                                        </button>
                                    </form >
                                
                                </dialog>

                            )}
                        </div>

                        <div className="painel">

                            <input type="search"
                            className="barra-pesquisa"
                            placeholder="Buscar por nome..."
                            value={filtroNome}
                            onChange={(e) => setFiltroNome(e.target.value)}
                            />

                            <div className="tabela-container">
                        
                            <table>
                                <thead>
                                    <tr>
                                        <th>
                                            Nome
                                            <button onClick={() => setOrdem(ordem === "asc" ? "desc" : "asc")}>
                                                {ordem === "asc" ? "A → Z" : "Z → A"}
                                            </button>
                                        </th>

                                        <th>
                                            Status
                                            <select
                                            value={filtroStatus}
                                            onChange={(e) => setFiltroStatus(e.target.value)}
                                            >
                                                <option value="todos">Todos</option>
                                                <option value="ativos">Ativos</option>
                                                <option value="inativos">Inatiovos</option>
                                            </select>
                                        </th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {produtosFiltradoNome.map((produto) => (
                                        <tr key={produto.id}>

                                            <td>{produto.nome}</td>

                                            <td>{produto.ativo ? "Ativo" : "Inativo"}</td>
                                        
                                            <td>
                                                <button onClick={() => alterarStatusProduto(produto)}>{produto.ativo ? "Desativar" : "Ativar"}</button>
                                            </td>

                                            <td>
                                                <button onClick={() => setProduto(produto)}>Editar</button>
                                            </td>

                                        </tr>
                                    ))}
                                </tbody>

                            </table>

                            {produto && (

                                <dialog open>

                                    <form onSubmit={(event) => editarProduto(event, produto)}>

                                        <label htmlFor="nomeEditar">Nome:</label>
                                    
                                        <input
                                        type="text"
                                        id="nomeEditar"
                                        value={produto.nome}
                                        onChange={(e) => setProduto({
                                            ...produto,
                                            nome: e.target.value
                                        })}
                                        required
                                        />
                                        
                                        <button type="submit">Salvar</button>

                                        <button type="button" onClick={() => setProduto(undefined)}>Cancelar</button>
                                    </form>

                                </dialog>
                            )}
                    
                        </div>

                    </div > 
                        
                </section>

                <div className="painel">
                    <h3>Relatório mensal</h3>

                    <div className="filtros-relatorio">

                        <label>
                            Mês:

                            <select
                                value={mesRelatorio}
                                onChange={(e) => setMesRelatorio(Number(e.target.value))}
                            >
                                {Array.from({ length: 12 }, (_, i) => (
                                    <option key={i + 1} value={i + 1}>
                                        {new Date(2000, i).toLocaleString("pt-BR", {
                                            month: "long"
                                        })}
                                    </option>
                                ))}
                            </select>
                        </label>

                        <label>
                            Ano:

                            <input
                                type="number"
                                value={anoRelatorio}
                                onChange={(e) => setAnoRelatorio(Number(e.target.value))}
                            />
                        </label>

                        <button onClick={gerarRelatorio}>
                            Gerar relatório PDF
                        </button>

                    </div>
                </div>

            </main>
        </>
    )

}

export default Produtos;