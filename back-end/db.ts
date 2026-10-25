import 'dotenv/config';
import {Pool} from 'pg';

const connectionString = process.env.DATABASE_URL;

if(!connectionString){
    throw new Error('DATABASE_URL não configurada');
}

const pool = new Pool({
    connectionString,
    ssl: {rejectUnauthorized: false}
});

pool.on('error', (err) => {
    console.error('Erro inesperado no pool:', err)
});

export default pool;