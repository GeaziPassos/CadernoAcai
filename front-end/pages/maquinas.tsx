import Sidebar from "../components/sidebar.js";
import Topbar from "../components/topbar.js";

import {useState} from "react";
import {useEffect} from "react";

function Maquinas() {

    return(
        <>
            <Sidebar/>

                <main className="conteudo">
                    <Topbar/>
                    <section>

                    </section>
                </main>

        </>
    );
}

export default Maquinas;