import express from "express";
import pool from "../connection.js"; // Asegúrate de usar la extensión .js
import pug from "pug";
import puppeteer from "puppeteer";
import path from "path";
import fs from "fs";
import { v1 as uuidv1 } from "uuid";
import { authenticateToken } from "../services/authentication.js";
import { fileURLToPath } from "url";

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 📌 Generar y almacenar un reporte en PDF
router.post("/generateReport", authenticateToken, async (req, res) => {
    try {
        const generatedUuid = uuidv1();
        const orderDetails = req.body;

        // Convertir productDetails en un array
        let productDetailsReport = [];
        try {
            productDetailsReport = JSON.parse(orderDetails.productDetails);
            if (!Array.isArray(productDetailsReport)) {
                productDetailsReport = [productDetailsReport];
            }
        } catch (error) {
            return res.status(400).json({ error: "Formato de productDetails incorrecto" });
        }

        // Renderizar la plantilla Pug
        const html = pug.renderFile(path.join(__dirname, "report.pug"), {
            productDetails: productDetailsReport,
            name: orderDetails.name,
            email: orderDetails.email,
            contactNumber: orderDetails.contactNumber,
            paymentMethod: orderDetails.paymentMethod,
            totalAmount: orderDetails.totalAmount,
        });

        // Generar el PDF con Puppeteer
        const browser = await puppeteer.launch({ headless: "new" });
        const page = await browser.newPage();
        await page.setContent(html, { waitUntil: "load" });

        const pdfPath = path.join(__dirname, "../generated_pdf", `${generatedUuid}.pdf`);
        await page.pdf({ path: pdfPath, format: "A4" });

        await browser.close();

        // Guardar en la base de datos
        const query =
            "INSERT INTO bill (name, uuid, email, contactNumber, paymentMethod, total, productDetails, createdBy) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";

        await pool.query(query, [
            orderDetails.name,
            generatedUuid,
            orderDetails.email,
            orderDetails.contactNumber,
            orderDetails.paymentMethod,
            orderDetails.totalAmount,
            orderDetails.productDetails,
            res.locals.email,
        ]);

        return res.status(200).json({ uuid: generatedUuid, pdfPath });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: err.message });
    }
});

// 📌 Obtener un PDF por UUID
router.post("/getPdf", authenticateToken, async (req, res) => {
    try {
        const { uuid } = req.body;

        if (!uuid) {
            return res.status(400).json({ error: "El UUID es obligatorio" });
        }

        const pdfPath = path.join(__dirname, "../generated_pdf", `${uuid}.pdf`);

        if (!fs.existsSync(pdfPath)) {
            return res.status(404).json({ error: "El archivo PDF no existe" });
        }

        res.setHeader("Content-Type", "application/pdf");
        res.sendFile(pdfPath);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error al obtener el PDF" });
    }
});

// 📌 Obtener todas las facturas ordenadas por ID descendente
router.post("/getBills", authenticateToken, async (req, res) => {
    try {
        const query = "SELECT * FROM bill ORDER BY id DESC";
        const [results] = await pool.query(query);
        return res.status(200).json(results);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: err.message });
    }
});

// 📌 Eliminar una factura por ID
router.delete("/delete/:id", authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const query = "DELETE FROM bill WHERE id = ?";

        const [results] = await pool.query(query, [id]);

        if (results.affectedRows === 0) {
            return res.status(404).json({ message: "Registro no encontrado" });
        }
        return res.status(200).json({ message: "Factura eliminada correctamente" });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: err.message });
    }
});

// 📌 Exportamos el router en formato ESM
export default router;
