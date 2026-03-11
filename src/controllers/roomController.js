import { prisma } from "../config/db.js";
import { asyncHandler } from "../middleware/asyncHandler.js";

const normalizeStringArray = (value) => {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch (_error) {
    return String(value)
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }
};

export const getRooms = asyncHandler(async (req, res) => {
  const rooms = await prisma.room.findMany({
    orderBy: { createdAt: "desc" }
  });
  res.status(200).json({ success: true, data: rooms });
});

export const getRoomById = asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) {
    res.status(400);
    throw new Error("Invalid room id");
  }

  const room = await prisma.room.findUnique({
    where: { id }
  });

  if (!room) {
    res.status(404);
    throw new Error("Room not found");
  }

  res.status(200).json({ success: true, data: room });
});

export const createRoom = asyncHandler(async (req, res) => {
  const { title, description, price, occupancy, amenities, images } = req.body;
  if (!title || !description || !price || !occupancy) {
    res.status(400);
    throw new Error("Title, description, price, and occupancy are required");
  }

  const uploadedImages = req.files?.map((file) => `/uploads/${file.filename}`) || [];
  const room = await prisma.room.create({
    data: {
      title,
      description,
      price: Number(price),
      occupancy,
      amenities: normalizeStringArray(amenities),
      images: uploadedImages.length ? uploadedImages : normalizeStringArray(images)
    }
  });

  res.status(201).json({ success: true, data: room });
});

export const updateRoom = asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) {
    res.status(400);
    throw new Error("Invalid room id");
  }
  const existing = await prisma.room.findUnique({ where: { id } });
  if (!existing) {
    res.status(404);
    throw new Error("Room not found");
  }

  const { title, description, price, occupancy, amenities, images } = req.body;
  const uploadedImages = req.files?.map((file) => `/uploads/${file.filename}`) || [];

  const room = await prisma.room.update({
    where: { id },
    data: {
      title: title ?? existing.title,
      description: description ?? existing.description,
      price: price ? Number(price) : existing.price,
      occupancy: occupancy ?? existing.occupancy,
      amenities: amenities ? normalizeStringArray(amenities) : existing.amenities,
      images: uploadedImages.length
        ? uploadedImages
        : images
          ? normalizeStringArray(images)
          : existing.images
    }
  });

  res.status(200).json({ success: true, data: room });
});

export const deleteRoom = asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) {
    res.status(400);
    throw new Error("Invalid room id");
  }
  const existing = await prisma.room.findUnique({ where: { id } });

  if (!existing) {
    res.status(404);
    throw new Error("Room not found");
  }

  await prisma.room.delete({ where: { id } });
  res.status(200).json({ success: true, message: "Room deleted" });
});
