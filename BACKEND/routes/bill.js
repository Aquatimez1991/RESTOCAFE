const express = require('express');
const connection = require('../connection');
const router = express.Router();
const pug = require('pug');
const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');
const uuid = require('uuid');
const auth = require('../services/authentication');

router.post('/generateReport', auth.authenticateToken, async (req, res) => {
    try {
        const generatedUuid = uuid.v1();
        const orderDetails = req.body;

        // Convertir productDetails en un array
        let productDetailsReport = [];
        try {
            productDetailsReport = JSON.parse(orderDetails.productDetails);
            if (!Array.isArray(productDetailsReport)) {
                productDetailsReport = [productDetailsReport]; // Lo convierte en un array si es un objeto
            }
        } catch (error) {
            return res.status(400).json({ error: "Formato de productDetails incorrecto" });
        }        

        // Renderizar la plantilla Pug
        const html = pug.renderFile(path.join(__dirname, 'report.pug'), {
            productDetails: productDetailsReport,
            name: orderDetails.name,
            email: orderDetails.email,
            contactNumber: orderDetails.contactNumber,
            paymentMethod: orderDetails.paymentMethod,
            totalAmount: orderDetails.totalAmount
        });

        // Lanzar Puppeteer y generar PDF
        const browser = await puppeteer.launch({ headless: "new" }); // Evita errores en algunas versiones
        const page = await browser.newPage();
        await page.setContent(html, { waitUntil: 'load' });

        const pdfPath = path.join(__dirname, '../generated_pdf', `${generatedUuid}.pdf`);
        await page.pdf({ path: pdfPath, format: 'A4' });

        await browser.close();

        // Guardar en la base de datos
        const query = "INSERT INTO bill (name, uuid, email, contactNumber, paymentMethod, total, productDetails, createdBy) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
        connection.query(query, [
            orderDetails.name, generatedUuid, orderDetails.email, orderDetails.contactNumber,
            orderDetails.paymentMethod, orderDetails.totalAmount, orderDetails.productDetails, res.locals.email
        ], (err, results) => {
            if (err) {
                return res.status(500).json(err);
            }
            return res.status(200).json({ uuid: generatedUuid, pdfPath });
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json(err);
    }
});

router.post('/getPdf', auth.authenticateToken, async (req, res) => {
    try {
        const { uuid } = req.body;

        if (!uuid) {
            return res.status(400).json({ error: "El UUID es obligatorio" });
        }

        const pdfPath = path.join(__dirname, '../generated_pdf', `${uuid}.pdf`);

        // Verificar si el archivo existe
        if (!fs.existsSync(pdfPath)) {
            return res.status(404).json({ error: "El archivo PDF no existe" });
        }

        // Enviar el PDF como respuesta
        res.setHeader('Content-Type', 'application/pdf');
        res.sendFile(pdfPath);

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error al obtener el PDF" });
    }
});

// Obtener todas las facturas ordenadas por id DESC
router.post('/getBills', auth.authenticateToken, async (req, res) => {
    try {
        const query = "SELECT * FROM bill ORDER BY id DESC";
        connection.query(query, (err, results) => {
            if (err) {
                return res.status(500).json(err);
            }
            return res.status(200).json(results);
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json(err);
    }
});

// Eliminar un registro por id
router.delete('/delete/:id', auth.authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const query = "DELETE FROM bill WHERE id = ?";
        connection.query(query, [id], (err, results) => {
            if (err) {
                return res.status(500).json(err);
            }
            if (results.affectedRows === 0) {
                return res.status(404).json({ message: "Registro no encontrado" });
            }
            return res.status(200).json({ message: "Factura eliminada correctamente" });
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json(err);
    }
});


module.exports = router;
