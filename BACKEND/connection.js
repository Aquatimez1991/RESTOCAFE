import mysql from 'mysql2';
import dotenv from 'dotenv';

dotenv.config();

// Configurar el pool de conexiones
const pool = mysql.createPool({
    port: process.env.DB_PORT,
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10, // Número máximo de conexiones simultáneas
    queueLimit: 0
});

// Verificar conexión con el pool
pool.getConnection((err, connection) => {
    if (err) {
        console.error("Error al conectar con la base de datos:", err);
    } else {
        console.log("✅ Conexión a la base de datos establecida.");
        connection.release(); // Liberar la conexión después de la prueba
    }
});

// Exportar el pool con promesas para usar async/await
export default pool.promise();
