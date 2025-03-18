import express from "express";
import pool from "../connection.js"; // Asegúrate de usar la extensión .js
import { authenticateToken } from "../services/authentication.js";
import { checkRole } from "../services/checkRole.js";

const router = express.Router();

// 📌 Agregar una nueva categoría
router.post("/add", authenticateToken, checkRole, async (req, res) => {
    try {
        const { name } = req.body;
        const query = "INSERT INTO category (name) VALUES (?)";
        
        await pool.query(query, [name]);
        return res.status(200).json({ message: "Category Added Successfully" });

    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

// 📌 Obtener todas las categorías ordenadas por nombre
router.get("/get", authenticateToken, async (req, res) => {
    try {
        const query = "SELECT * FROM category ORDER BY name";
        const [results] = await pool.query(query);
        
        return res.status(200).json(results);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

// 📌 Actualizar una categoría
router.patch("/update", authenticateToken, checkRole, async (req, res) => {
    try {
        const { id, name } = req.body;
        const query = "UPDATE category SET name = ? WHERE id = ?";
        
        const [results] = await pool.query(query, [name, id]);

        if (results.affectedRows === 0) {
            return res.status(400).json({ message: "Category ID not found" });
        }
        return res.status(200).json({ message: "Category Updated Successfully" });

    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

// 📌 Exportamos el router en formato ESM
export default router;
