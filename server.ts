import 'dotenv/config';
import express from "express";
import cors from "cors";
import clienteRoutes from "./src/routes/pessoasRoutes.js";
const port = Number(process.env.PORT) || 3006;

const app = express();

app.use(cors())

app.use('/pessoas', clienteRoutes);

app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});