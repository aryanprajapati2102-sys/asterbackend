import { prisma } from "../config/db.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { sendEnquiryNotification } from "../services/emailService.js";

export const createEnquiry = asyncHandler(async (req, res) => {
  const { name, email, phone, moveInDate, roomType, message } = req.body;

  if (!name || !phone) {
    res.status(400);
    throw new Error("Name and phone are required");
  }

  const enquiry = await prisma.enquiry.create({
    data: {
      name,
      email: email || null,
      phone,
      moveInDate: moveInDate ? new Date(moveInDate) : null,
      roomType: roomType || null,
      message: message || null
    }
  });

  sendEnquiryNotification({ name, email, phone, moveInDate, roomType, message }).catch(() => {});

  res.status(201).json({ success: true, data: enquiry });
});

export const getEnquiries = asyncHandler(async (req, res) => {
  const enquiries = await prisma.enquiry.findMany({
    orderBy: { createdAt: "desc" }
  });

  res.status(200).json({ success: true, data: enquiries });
});

export const deleteEnquiry = asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) {
    res.status(400);
    throw new Error("Invalid enquiry id");
  }

  const enquiry = await prisma.enquiry.findUnique({ where: { id } });
  if (!enquiry) {
    res.status(404);
    throw new Error("Enquiry not found");
  }

  await prisma.enquiry.delete({ where: { id } });

  res.status(200).json({ success: true, message: "Enquiry deleted" });
});
