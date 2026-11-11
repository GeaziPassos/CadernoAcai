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
        const resposta = await fetch("localhost:3006/produtos");
        
        const dados: Produto[] = await resposta.json();

        setProdutos(dados);
    }

    async function cadastrarProduto(event: React.FormEvent<HTMLFormElement>){
        event.preventDefault();

        const reposta = await fetch("localhost:3006/produtos", {
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

                </main>
        </>
    )

}