import dotenv from "dotenv";

dotenv.config();

function checkRole(req, res, next) {
  const userRole = res.locals.user?.role; // Acceder correctamente al rol del usuario

  if (!userRole) {
    return res.status(403).json({ message: "Acceso denegado: rol no definido" });
  }

  if (userRole === "user") { 
    return res.status(401).json({ message: "Acceso no autorizado" });
  }

  next();
}

export { checkRole };
