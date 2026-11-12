import { useState } from "react";

import Sidebar from "../components/sidebar.js"
import Topbar from "../components/topbar.js"

function Escala() {

    return(
        <>
            <Sidebar />

                <main className="conteudo">
                    <Topbar />
                </main>
        </>
    )
}

export default Escala