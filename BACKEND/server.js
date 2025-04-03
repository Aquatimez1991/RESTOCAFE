import dotenv from "dotenv-safe";
import http from "http";
import app from "./index.js";

// 📌 Cargar variables de entorno de manera segura
dotenv.config();

// 📌 Definir el puerto del servidor
const PORT = process.env.PORT || 3000;

// 📌 Crear el servidor
const server = http.createServer(app);

// 📌 Iniciar el servidor
server.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
