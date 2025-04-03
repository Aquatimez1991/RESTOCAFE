import express from "express";
import pool from "../connection.js"; 
import { authenticateToken } from "../services/authentication.js";

const router = express.Router();

router.get("/details", authenticateToken, async (req, res) => {
    try {
        // Ejecutamos todas las consultas en paralelo con Promise.all()
        const [categoryResult, productResult, billResult] = await Promise.all([
            pool.query("SELECT COUNT(id) AS categoryCount FROM category"),
            pool.query("SELECT COUNT(id) AS productCount FROM product"),
            pool.query("SELECT COUNT(id) AS billCount FROM bill"),
        ]);

        // Extraemos los valores de los resultados (corrigiendo la estructura del pool de MySQL2)
        const categoryCount = categoryResult[0]?.[0]?.categoryCount || 0;
        const productCount = productResult[0]?.[0]?.productCount || 0;
        const billCount = billResult[0]?.[0]?.billCount || 0;

        // Enviamos la respuesta en formato JSON
        return res.status(200).json({
            category: categoryCount,
            product: productCount,
            bill: billCount,
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Error interno del servidor." });
    }
});

// 📌 Exportamos el router en formato ESM
export default router;
