import jwt from "jsonwebtoken";
import { JWT } from "../config.js";

export const isAuth = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ message: "No estás autorizado" });
  }

  jwt.verify(token, JWT, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "No estás autorizado" });
    }

    req.userId = decoded.id;
    req.userRole = decoded.role;  

    next();
  });
};



export const isAdmin = (req, res, next) => {

  if (!req.userId) {
    return res.status(401).json({ message: "No autorizado" });
  }

  if (req.userRole !== "admin") {
    return res.status(403).json({ message: "Acceso denegado. Se requiere rol de administrador." });
  }

  next();
};


export const isAdminOrOwner = (req, res, next) => {

  if (!req.userId) {
    return res.status(401).json({ message: "No autorizado" });
  }

  if (req.userRole !== "admin" && req.userRole !== "owner") {
    return res.status(403).json({ message: "Acceso denegado. Se requiere rol de administrador o propietario." });
  }

  next();
};

