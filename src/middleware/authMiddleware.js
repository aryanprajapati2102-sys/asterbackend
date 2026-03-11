import jwt from "jsonwebtoken";
import { prisma } from "../config/db.js";

export const protect = async (req, res, next) => {
  const header = req.headers.authorization;

  if (!header || !header.startsWith("Bearer ")) {
    res.status(401);
    return next(new Error("Not authorized, token missing"));
  }

  const token = header.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const admin = await prisma.admin.findUnique({
      where: { id: decoded.id },
      select: { id: true, email: true, role: true }
    });

    if (!admin) {
      res.status(401);
      return next(new Error("Not authorized, admin not found"));
    }

    req.admin = admin;
    next();
  } catch (error) {
    res.status(401);
    next(new Error("Not authorized, invalid token"));
  }
};

export const adminOnly = (req, res, next) => {
  if (!req.admin || req.admin.role !== "ADMIN") {
    res.status(403);
    return next(new Error("Forbidden: admin access required"));
  }

  next();
};
