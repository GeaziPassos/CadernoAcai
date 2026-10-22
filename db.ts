import mysql from 'mysql2';

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'geh12345',
    database: 'cadernoAcai',
    port: 3306
});

connection.connect((err: mysql.QueryError | null) =>{
    if(err){
        console.error('Erro ao conectar ao MySQL', err.message);
        return;
    }
    console.log("MySQL conectado")
})

export default connection;