import express from "express";
import pool from "../connection.js"; // USAMOS POOL
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";
import { google } from "googleapis";
import dotenv from "dotenv";
import crypto from "crypto"; // Necesario para generar el token
import { authenticateToken } from "../services/authentication.js";
import { checkRole } from "../services/checkRole.js";

dotenv.config();

const router = express.Router();
const OAuth2 = google.auth.OAuth2;
const saltRounds = 10; // Definir las rondas de encriptación

//  Configurar OAuth2
const oauth2Client = new OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  "https://developers.google.com/oauthplayground"
);

oauth2Client.setCredentials({
  refresh_token: process.env.REFRESH_TOKEN,
});

//  Crear un transportador de correo con OAuth2
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
router.post("/signup", async (req, res) => {
  let user = req.body;
  let query = "SELECT email FROM user WHERE email=?";
  
  try {
    const [results] = await pool.query(query, [user.email]);
    if (results.length > 0) {
      return res.status(400).json({ message: "El correo ya está registrado." });
    }

    const hashedPassword = await bcrypt.hash(user.password, saltRounds);
    query =
      "INSERT INTO user(name, contactNumber, email, password, status, role) VALUES (?, ?, ?, ?, 'false', 'user')";
    
    await pool.query(query, [user.name, user.contactNumber, user.email, hashedPassword]);
    return res.status(201).json({ message: "Registro exitoso." });
  } catch (err) {
    return res.status(500).json({ error: err });
  }
});

//  Inicio de sesión
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  let query = "SELECT email, password, role, status FROM user WHERE email=?";

  try {
    const [results] = await pool.query(query, [email]);
    if (results.length === 0) {
      return res.status(401).json({ message: "Usuario o contraseña incorrectos." });
    }

    const user = results[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ message: "Usuario o contraseña incorrectos." });
    }

    if (user.status === "false") {
      return res.status(403).json({ message: "Espera la aprobación del administrador." });
    }

    const payload = { email: user.email, role: user.role };
    const accessToken = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "8h",
    });

    res.status(200).json({ token: accessToken });
  } catch (err) {
    return res.status(500).json({ error: err });
  }
});

//  Recuperación de contraseña
router.post("/forgotPassword", async (req, res) => {
  const { email } = req.body;
  let query = "SELECT email FROM user WHERE email=?";

  try {
    const [results] = await pool.query(query, [email]);
    if (results.length === 0) {
      return res.status(404).json({ message: "Correo no encontrado." });
    }

    // Generar un token seguro de 32 caracteres
    const resetToken = crypto.randomBytes(32).toString("hex");

    // Guardar el token en la base de datos
    query = "UPDATE user SET reset_token=? WHERE email=?";
    await pool.query(query, [resetToken, email]);

    // Enlace de restablecimiento de contraseña
    const resetLink = `http://localhost:4200/reset-password?token=${resetToken}`;

    // Contenido del correo
    const mailContent = `
      <p><b>Solicitud de recuperación de contraseña</b></p>
      <p>Haz clic en el siguiente enlace para restablecer tu contraseña:</p>
      <a href="${resetLink}">Restablecer contraseña</a>
      <p>Si no solicitaste este cambio, ignora este mensaje.</p>
    `;

    // Enviar correo
    const transporter = await createTransporter();
    await transporter.sendMail({
      from: process.env.EMAIL,
      to: email,
      subject: "Recuperación de contraseña",
      html: mailContent,
    });

    return res.status(200).json({ message: "Correo enviado con éxito." });
  } catch (error) {
    console.error("Error en forgotPassword:", error);
    return res.status(500).json({ message: "Error al enviar el correo." });
  }
});

//  Restablecimiento de contraseña
router.post("/resetPassword", async (req, res) => {
  const { token, newPassword } = req.body;
  let query = "SELECT email FROM user WHERE reset_token=?";

  try {
    const [results] = await pool.query(query, [token]);
    if (results.length === 0) {
      return res.status(400).json({ message: "Token inválido o expirado." });
    }

    const email = results[0].email;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    // Actualizar la contraseña y eliminar el token
    query = "UPDATE user SET password=?, reset_token=NULL WHERE email=?";
    await pool.query(query, [hashedPassword, email]);

    return res.status(200).json({ message: "Contraseña actualizada correctamente." });
  } catch (err) {
    return res.status(500).json(err);
  }
});

// Ruta para obtener todos los usuarios con rol "user"
router.get("/get", authenticateToken, checkRole, async (req, res) => {
  let query = "SELECT id, name, email, contactNumber, status FROM user WHERE role='user'";

  try {
    const [results] = await pool.query(query);
    return res.status(200).json(results);
  } catch (err) {
    return res.status(500).json(err);
  }
});

// Ruta para actualizar el estado de un usuario por su ID
router.patch("/update", authenticateToken, checkRole, async (req, res) => {
  let { status, id } = req.body;
  let query = "UPDATE user SET status=? WHERE id=?";

  try {
    const [results] = await pool.query(query, [status, id]);
    if (results.affectedRows === 0) {
      return res.status(404).json({ message: "User id does not exist" });
    }
    return res.status(200).json({ message: "User Updated Successfully" });
  } catch (err) {
    return res.status(500).json(err);
  }
});

// Ruta para verificar si el token es válido
router.get("/checkToken", authenticateToken, (req, res) => {
  return res.status(200).json({ message: "true" });
});

// Ruta para cambiar la contraseña de un usuario
router.post("/changePassword", authenticateToken, async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const email = res.locals.email;

  let query = "SELECT password FROM user WHERE email=?";
  
  try {
    const [results] = await pool.query(query, [email]);
    if (results.length === 0) {
      return res.status(404).json({ message: "Usuario no encontrado." });
    }

    const user = results[0];
    const match = await bcrypt.compare(oldPassword, user.password);
    if (!match) {
      return res.status(400).json({ message: "Contraseña antigua incorrecta." });
    }

    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
    query = "UPDATE user SET password=? WHERE email=?";
    await pool.query(query, [hashedPassword, email]);

    return res.status(200).json({ message: "Contraseña actualizada correctamente." });
  } catch (err) {
    return res.status(500).json(err);
  }
});

export default router;
