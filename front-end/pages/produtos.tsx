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
    const [filtroNome, setFiltroNome] = useState("");
    const [produto, setProduto] = useState<Produto>();

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
        const resposta = await fetch("http://localhost:3006/produtos/update")
    }
  
    useEffect(() => {
        carregarProdutos();
    }, []);
    
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

                            {produto &&
                                <dialog open>

                                    <form onSubmit={(event) => editarProduto(event, produto)}>

                                        <label htmlFor="Nome">Nome:</label>
                                    
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
                            }
                    
                        </div>

                    </div > 
                        
                </section>

            </main>
        </>
    )

}

export default Produtos;