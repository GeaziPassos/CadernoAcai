import Sidebar from "../components/sidebar.js";
import Topbar from "../components/topbar.js";

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
    const [filtroNome, setFiltroNome] = useState("")

    async function carregarProdutos(){
        const resposta = await fetch("http://localhost:3006/produtos");
        
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

    useEffect(() => {
        carregarProdutos();
    }, []);

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

    return(
        <>
            <Sidebar />

                <main className="conteudo">
                    <Topbar />

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
                                        
                                        <label htmlFor="Nome">Nome:</label>

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

                                            <td>{produto.ativo}</td>
                                        
                                        </tr>
                                    ))}
                                </tbody>

                            </table>
                    
                        </div>

                    </div > 
                        
                </section>

            </main>
        </>
    )

}

export default Produtos;