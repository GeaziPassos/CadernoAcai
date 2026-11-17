import { useState } from "react";

import Sidebar from "../components/sidebar.js"
import Topbar from "../components/topbar.js"

interface Maquina{
    id: number,
    linha: number,
    tag: String,
    ativo: boolean
}

function Escala() {

    async function buscarMaquinas(){
        const dados = await fetch("http://localhost:3006/maquinas")
        const resultado = dados.json();
        return console.log(resultado);
    }

    return(
        <>
            <Sidebar />

                <main className="conteudo">
                    <div className="tabela-escala">
                        
                        <div className="maquina-container">
                            {buscarMaquinas()}
                        </div>                        
                    </div>
                </main>
        </>
    )
}

export default Escala