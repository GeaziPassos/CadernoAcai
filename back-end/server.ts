import 'dotenv/config';
import express from "express";
import cors from "cors";

import pessoaRoutes from "./src/pessoa/pessoaRoutes.js";
import maquinaRoutes from "./src/maquina/maquinaRoutes.js";
import produtoRoutes from "./src/produto/produtoRoutes.js";
import escalaRoutes from "./src/escala/escalaRoutes.js";
import relatorioRoutes from "./src/relatorios/relatorioRoutes.js";

const port = Number(process.env.PORT) || 3006;

const app = express();

app.use(cors({
    origin: "http://localhost:5173"
}));

app.use(express.json());

app.use("/escalas", escalaRoutes);
app.use('/pessoas', pessoaRoutes);
app.use('/maquinas', maquinaRoutes)
app.use('/produtos', produtoRoutes)
app.use("/relatorios", relatorioRoutes);

app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});

export default app;