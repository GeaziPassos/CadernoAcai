import express from "express";
import cors from "cors";
import clienteRoutes from "./src/routes/pessoasRoutes.js";
const port = 3006;

const app = express();

app.use(cors())