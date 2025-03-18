import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config();

function authenticateToken(req, res, next) {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json({ message: "Acceso no autorizado: Token no proporcionado" });
    }

    if (!process.env.JWT_SECRET) {
        return res.status(500).json({ message: "Error del servidor: Falta JWT_SECRET en configuración" });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: "Token inválido o expirado" });
        }

        res.locals.user = decoded; // Guardamos el usuario en un objeto específico
        next();
    });
}

export { authenticateToken };
