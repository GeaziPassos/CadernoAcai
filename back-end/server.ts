import 'dotenv/config';
import express from "express";
import cors from "cors";
import pessoaRoutes from "./src/pessoas/pessoasRoutes.js";
const port = Number(process.env.PORT) || 3006;

const app = express();

app.use(cors())

app.use('/pessoas', pessoaRoutes);

app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});