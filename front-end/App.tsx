import { BrowserRouter, Routes, Route } from "react-router-dom";

import Escala from "./pages/escala.js";
import Pessoas from "./pages/pessoas.js";
import Maquinas from "./pages/maquinas.js";
import Produtos from "./pages/produtos.js";


function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Pessoas />}></Route>
                <Route path="/escala" element={<Escala />}></Route>
                <Route path="/pessoas" element={<Pessoas />}></Route>
                <Route path="/produtos" element={<Produtos />}></Route>
                <Route path="/maquinas" element={<Maquinas />}></Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
