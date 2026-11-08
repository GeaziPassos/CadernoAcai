import Sidebar from "./../components/sidebar.js"
import Topbar from "./../components/topbar.js"

import {useState} from "react";
import { useEffect } from "react";
import "./site.css";

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

function Pessoa() {
    const [modalAberto, setModalAberto] = useState(false);
    const [nome, setNome] = useState("");
    const [pessoas, setPessoas] = useState<Pessoa[]>([]);
    
    async function carregarPessoas(){
        const resposta = await fetch("http://localhost:3006/pessoas")

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

    useEffect(() => {
        carregarPessoas()
    }, []);
    
    return(
        <body>

            <Sidebar/>
            
            <main className="conteudo">
                <Topbar/>

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

                        <div className="painel-topo">
                                <h3>Equipe</h3>
                        </div>

                        <input
                        type="search" 
                        className="barra-pesquisa"
                        placeholder="Buscar por nome..."
                        />

                        <div className="tabela-container">

                            <table>
                                <thead>
                                    <tr>
                                        <th>Nome</th>
                                        <th>Dupla</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {pessoas.map((pessoa) => (
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
        </body>
    )
}

export default Pessoa;