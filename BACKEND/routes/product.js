import express from "express";
import pool from "../connection.js"; // Pool de conexiones con extensión .js
import { authenticateToken } from "../services/authentication.js";
import { checkRole } from "../services/checkRole.js";
import Joi from "joi";

const router = express.Router();

// Esquema de validación con Joi
const productSchema = Joi.object({
    name: Joi.string().min(3).max(100).required(),
    categoryId: Joi.number().integer().positive().required(),
    description: Joi.string().max(500).allow(""),
    price: Joi.number().precision(2).positive().required(),
});

// 📌 Agregar un producto con validación
router.post("/add", authenticateToken, checkRole, async (req, res) => {
    const { error } = productSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    try {
        const { name, categoryId, description, price } = req.body;
        const query = "INSERT INTO product (name, categoryId, description, price, status) VALUES (?, ?, ?, ?, 1)";
        await pool.query(query, [name, categoryId, description, price]);

        return res.status(201).json({ message: "Producto agregado exitosamente." });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Error interno del servidor." });
    }
});

// 📌 Obtener productos por categoría con validación
router.get("/getByCategory/:id", authenticateToken, async (req, res) => {
    const categoryId = parseInt(req.params.id, 10);
    if (isNaN(categoryId) || categoryId <= 0) {
        return res.status(400).json({ message: "ID de categoría inválido." });
    }

    try {
        const query = "SELECT id, name FROM product WHERE categoryId = ? AND status = 1";
        const [results] = await pool.query(query, [categoryId]);
        return res.status(200).json(results);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Error al obtener los productos." });
    }
});

// 📌 Exportar router en formato ESM
export default router;
