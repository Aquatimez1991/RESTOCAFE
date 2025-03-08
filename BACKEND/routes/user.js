const express = require("express");
const connection = require("../connection");
const router = express.Router();
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const { google } = require("googleapis");
require("dotenv").config();

var auth = require("../services/authentication");
var checkRole = require("../services/checkRole");

const OAuth2 = google.auth.OAuth2;

//  Configurar OAuth2
const oauth2Client = new OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  "https://developers.google.com/oauthplayground"
);

oauth2Client.setCredentials({
  refresh_token: process.env.REFRESH_TOKEN,
});

//  Función para crear un transportador de correo
async function createTransporter() {
  const accessToken = await oauth2Client.getAccessToken();

  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: process.env.EMAIL,
      clientId: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      refreshToken: process.env.REFRESH_TOKEN,
      accessToken: accessToken.token,
    },
  });
}

//  Registro de usuarios
router.post("/signup", (req, res) => {
  let user = req.body;
  let query = "SELECT email FROM user WHERE email=?";

  connection.query(query, [user.email], (err, results) => {
    if (err) return res.status(500).json({ error: err });

    if (results.length > 0) {
      return res.status(400).json({ message: "El correo ya está registrado." });
    }

    query =
      "INSERT INTO user(name, contactNumber, email, password, status, role) VALUES (?, ?, ?, ?, 'false', 'user')";
    connection.query(
      query,
      [user.name, user.contactNumber, user.email, user.password],
      (err, results) => {
        if (err) return res.status(500).json({ error: err });
        return res.status(201).json({ message: "Registro exitoso." });
      }
    );
  });
});

//  Inicio de sesión
router.post("/login", (req, res) => {
  const user = req.body;
  let query = "SELECT email, password, role, status FROM user WHERE email=?";

  connection.query(query, [user.email], (err, results) => {
    if (err) return res.status(500).json({ error: err });

    if (results.length === 0 || results[0].password !== user.password) {
      return res
        .status(401)
        .json({ message: "Usuario o contraseña incorrectos." });
    }

    if (results[0].status === "false") {
      return res
        .status(403)
        .json({ message: "Espera la aprobación del administrador." });
    }

    //  Generar token JWT correctamente
    const payload = { email: results[0].email, role: results[0].role };
    const accessToken = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "8h",
    });

    res.status(200).json({ token: accessToken });
  });
});

//  Recuperación de contraseña
router.post("/forgotPassword", async (req, res) => {
  const { email } = req.body;
  let query = "SELECT email, password FROM user WHERE email=?";

  connection.query(query, [email], async (err, results) => {
    if (err) return res.status(500).json({ error: err });

    if (results.length === 0) {
      return res.status(404).json({ message: "Correo no encontrado." });
    }

    const user = results[0];

    const mailContent = `
      <p><b>Detalles de acceso a Cafe Management System</b></p>
      <p><b>Email:</b> ${user.email}</p>
      <p><b>Contraseña:</b> ${user.password}</p>
      <a href="http://localhost:4200">Haz clic aquí para iniciar sesión</a>
    `;

    try {
      const transporter = await createTransporter();
      await transporter.sendMail({
        from: process.env.EMAIL,
        to: user.email,
        subject: "Recuperación de contraseña",
        html: mailContent,
      });

      return res.status(200).json({ message: "Correo enviado exitosamente." });
    } catch (error) {
      console.error("Error enviando correo:", error);
      return res.status(500).json({ message: "Error al enviar el correo." });
    }
  });
});

//  Manejo de errores globales
process.on("uncaughtException", (err) => {
  console.error("Excepción no controlada:", err);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("Promesa rechazada sin manejar:", promise, "Razón:", reason);
});

// Ruta para obtener todos los usuarios con rol "user"
router.get("/get", auth.authenticateToken, checkRole.checkRole, (req, res) => {
  var query =
    "select id,name,email,contactNumber,status from user where role='user'";
  connection.query(query, (err, results) => {
    if (!err) {
      return res.status(200).json(results);
    } else {
      return res.status(500).json(err);
    }
  });
});
// Ruta para actualizar el estado de un usuario por su ID
router.patch(
  "/update",
  auth.authenticateToken,
  checkRole.checkRole,
  (req, res) => {
    let user = req.body;
    var query = "update user set status=? where id=?";
    connection.query(query, [user.status, user.id], (err, results) => {
      if (!err) {
        if (results.affectedRows == 0) {
          return res.status(404).json({ message: "User id does not exist" });
        }
        return res.status(200).json({ message: "User Updated Successfully" });
      } else {
        return res.status(500).json(err);
      }
    });
  }
);
// Ruta para verificar si el token es válido (simplemente responde con "true")
router.get("/checkToken", auth.authenticateToken, (req, res) => {
  return res.status(200).json({ message: "true" });
});
// Ruta para cambiar la contraseña de un usuario
router.post("/changePassword", auth.authenticateToken, (req, res) => {
  const user = req.body;
  const email = res.locals.email; 

  // Verifica si la contraseña antigua es correcta
  var query = "SELECT * FROM user WHERE email=? AND password=?";
  connection.query(query, [email, user.oldPassword], (err, results) => {
    if (!err) {
      if (results.length <= 0) {
        return res.status(400).json({ message: "Incorrect Old Password" });
      } 
      
      // Si la contraseña antigua es correcta, actualiza la nueva
      query = "UPDATE user SET password=? WHERE email=?";
      connection.query(query, [user.newPassword, email], (err, results) => {
        if (!err) {
          return res.status(200).json({ message: "Password Updated Successfully." });
        } else {
          return res.status(500).json(err);
        }
      });
      
    } else {
      return res.status(500).json(err); 
    }
  });
});


module.exports = router;
