import express from "express";
import pool from "../connection.js";
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
    const query =
      "INSERT INTO product (name, categoryId, description, price, status) VALUES (?, ?, ?, ?, 1)";
    await pool.query(query, [name, categoryId, description, price]);

    return res.status(201).json({ message: "Producto agregado exitosamente." });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Error interno del servidor." });
  }
});

// 📌 Obtener todos los productos
router.get("/get", authenticateToken, async (req, res) => {
  try {
    const query =
      "SELECT p.id, p.name, p.description, p.price, p.status, c.id AS categoryId, c.name AS categoryName FROM product AS p INNER JOIN category AS c ON p.categoryId = c.id";
    const [results] = await pool.query(query);
    return res.status(200).json({ data: results });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Error al obtener los productos." });
  }
});

// 📌 Obtener productos por categoría
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

// 📌 Obtener un producto por ID
router.get("/getByID/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const query = "SELECT id, name, description, price FROM product WHERE id = ?";
    const [results] = await pool.query(query, [id]);
    if (results.length === 0) {
      return res.status(404).json({ message: "Producto no encontrado." });
    }
    return res.status(200).json({ data: results[0] });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Error al obtener el producto." });
  }
});

// 📌 Actualizar un producto
router.patch("/update", authenticateToken, checkRole, async (req, res) => {
  const { id, name, categoryId, description, price } = req.body;
  if (!id) return res.status(400).json({ message: "ID del producto es requerido." });

  try {
    const query =
      "UPDATE product SET name = ?, categoryId = ?, description = ?, price = ? WHERE id = ?";
    const [result] = await pool.query(query, [
      name,
      categoryId,
      description,
      price,
      id,
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Producto no encontrado." });
    }

    return res.status(200).json({ message: "Producto actualizado exitosamente." });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Error al actualizar el producto." });
  }
});

// 📌 Eliminar un producto
router.delete("/delete/:id", authenticateToken, checkRole, async (req, res) => {
  const id = req.params.id;
  try {
    const query = "DELETE FROM product WHERE id = ?";
    const [result] = await pool.query(query, [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Producto no encontrado." });
    }

    return res.status(200).json({ message: "Producto eliminado exitosamente." });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Error al eliminar el producto." });
  }
});

// 📌 Actualizar el estado de un producto
router.patch("/updateStatus", authenticateToken, checkRole, async (req, res) => {
  const { id, status } = req.body;
  if (!id || typeof status !== "boolean") {
    return res.status(400).json({ message: "ID y estado son requeridos." });
  }

  try {
    const query = "UPDATE product SET status = ? WHERE id = ?";
    const [result] = await pool.query(query, [status, id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Producto no encontrado." });
    }

    return res.status(200).json({ message: "Estado del producto actualizado." });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Error al actualizar el estado del producto." });
  }
});

// 📌 Exportar router en formato ESM
export default router;
