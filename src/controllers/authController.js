import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../config/db.js";
import { asyncHandler } from "../middleware/asyncHandler.js";

export const adminLogin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error("Email and password are required");
  }

  const admin = await prisma.admin.findUnique({ where: { email } });
  if (!admin) {
    res.status(401);
    throw new Error("Invalid credentials");
  }

  const matches = await bcrypt.compare(password, admin.password);
  if (!matches) {
    res.status(401);
    throw new Error("Invalid credentials");
  }

  const token = jwt.sign({ id: admin.id, role: admin.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d"
  });

  res.status(200).json({
    success: true,
    data: {
      token,
      admin: {
        id: admin.id,
        email: admin.email,
        role: admin.role
      }
    }
  });
});
