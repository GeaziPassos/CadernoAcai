import 'dotenv/config';
import express from "express";
import cors from "cors";
import pessoaRoutes from "./src/pessoas/pessoaRoutes.js";
const port = Number(process.env.PORT) || 3006;

const app = express();

app.use(cors())

app.use(express.json());
app.use('/pessoas', pessoaRoutes);

app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});

export default app;