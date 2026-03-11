import slugify from "slugify";
import { prisma } from "../config/db.js";
import { asyncHandler } from "../middleware/asyncHandler.js";

const buildSlug = (title) =>
  slugify(title, {
    lower: true,
    strict: true,
    trim: true
  });

export const getBlogs = asyncHandler(async (req, res) => {
  const blogs = await prisma.blog.findMany({
    orderBy: { createdAt: "desc" }
  });
  res.status(200).json({ success: true, data: blogs });
});

export const getBlogBySlug = asyncHandler(async (req, res) => {
  const blog = await prisma.blog.findUnique({
    where: { slug: req.params.slug }
  });

  if (!blog) {
    res.status(404);
    throw new Error("Blog not found");
  }

  res.status(200).json({ success: true, data: blog });
});

export const createBlog = asyncHandler(async (req, res) => {
  const { title, content, excerpt, featuredImage } = req.body;

  if (!title || !content || !excerpt) {
    res.status(400);
    throw new Error("Title, content, and excerpt are required");
  }

  const slug = buildSlug(title);
  const exists = await prisma.blog.findUnique({ where: { slug } });
  if (exists) {
    res.status(400);
    throw new Error("A blog with a similar title already exists");
  }

  const imageFromUpload = req.file ? `/uploads/${req.file.filename}` : null;
  const blog = await prisma.blog.create({
    data: {
      title,
      slug,
      content,
      excerpt,
      featuredImage: imageFromUpload || featuredImage || null
    }
  });

  res.status(201).json({ success: true, data: blog });
});

export const updateBlog = asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) {
    res.status(400);
    throw new Error("Invalid blog id");
  }
  const existing = await prisma.blog.findUnique({ where: { id } });
  if (!existing) {
    res.status(404);
    throw new Error("Blog not found");
  }

  const { title, content, excerpt, featuredImage } = req.body;
  const slug = title ? buildSlug(title) : existing.slug;
  const imageFromUpload = req.file ? `/uploads/${req.file.filename}` : null;

  const blog = await prisma.blog.update({
    where: { id },
    data: {
      title: title ?? existing.title,
      slug,
      content: content ?? existing.content,
      excerpt: excerpt ?? existing.excerpt,
      featuredImage: imageFromUpload || featuredImage || existing.featuredImage
    }
  });

  res.status(200).json({ success: true, data: blog });
});

export const deleteBlog = asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) {
    res.status(400);
    throw new Error("Invalid blog id");
  }
  const existing = await prisma.blog.findUnique({ where: { id } });
  if (!existing) {
    res.status(404);
    throw new Error("Blog not found");
  }

  await prisma.blog.delete({ where: { id } });
  res.status(200).json({ success: true, message: "Blog deleted" });
});
