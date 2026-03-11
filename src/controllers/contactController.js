import { prisma } from "../config/db.js";
import { asyncHandler } from "../middleware/asyncHandler.js";

export const createContactMessage = asyncHandler(async (req, res) => {
  const { name, email, phone, message } = req.body;

  if (!name || !email || !message) {
    res.status(400);
    throw new Error("Name, email, and message are required");
  }

  const contactMessage = await prisma.contactMessage.create({
    data: {
      name,
      email,
      phone: phone || null,
      message
    }
  });

  res.status(201).json({ success: true, data: contactMessage });
});

export const getContactMessages = asyncHandler(async (req, res) => {
  const messages = await prisma.contactMessage.findMany({
    orderBy: { createdAt: "desc" }
  });

  res.status(200).json({ success: true, data: messages });
});
