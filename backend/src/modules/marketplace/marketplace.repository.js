import { prisma } from "../../config/database.js";

/**
 * Marketplace Repository - Data Access Layer
 * Handles all database operations for listings and orders
 */

// ===== LISTING operations =====

export async function createListing(data) {
  return await prisma.listing.create({
    data,
    include: {
      seller: true,
      post: true,
    },
  });
}

export async function findListingById(id) {
  return await prisma.listing.findUnique({
    where: { id },
    include: {
      seller: true,
      post: true,
      _count: { select: { orders: true } },
    },
  });
}

export async function findAllListings({ status, category, medium, minPrice, maxPrice, sellerId, limit = 20, page = 1 }) {
  const where = {};
  if (status) where.status = status;
  if (category) where.category = category;
  if (medium) where.medium = medium;
  if (sellerId) where.sellerId = sellerId;
  if (minPrice !== undefined || maxPrice !== undefined) {
    where.price = {};
    if (minPrice !== undefined) where.price.gte = minPrice;
    if (maxPrice !== undefined) where.price.lte = maxPrice;
  }

  const skip = (page - 1) * limit;

  const [listings, total] = await Promise.all([
    prisma.listing.findMany({
      where,
      include: {
        seller: true,
        _count: { select: { orders: true } },
      },
      orderBy: { createdAt: "desc" },
      take: limit,
      skip,
    }),
    prisma.listing.count({ where }),
  ]);

  return { listings, total, page, totalPages: Math.ceil(total / limit) };
}

export async function searchListings(query, limit = 20) {
  return await prisma.listing.findMany({
    where: {
      status: "AVAILABLE",
      OR: [
        { title: { contains: query, mode: "insensitive" } },
        { description: { contains: query, mode: "insensitive" } },
      ],
    },
    include: {
      seller: true,
      _count: { select: { orders: true } },
    },
    orderBy: { createdAt: "desc" },
    take: limit,
  });
}

export async function updateListing(id, data) {
  return await prisma.listing.update({
    where: { id },
    data,
    include: {
      seller: true,
      post: true,
    },
  });
}

export async function deleteListing(id) {
  return await prisma.listing.delete({ where: { id } });
}

// ===== ORDER operations =====

export async function createOrder(data) {
  return await prisma.order.create({
    data,
    include: {
      buyer: true,
      listing: { include: { seller: true } },
    },
  });
}

export async function findOrderById(id) {
  return await prisma.order.findUnique({
    where: { id },
    include: {
      buyer: true,
      listing: { include: { seller: true } },
    },
  });
}

export async function findOrdersByBuyer(buyerId) {
  return await prisma.order.findMany({
    where: { buyerId },
    include: {
      listing: { include: { seller: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function findOrdersBySeller(sellerId) {
  return await prisma.order.findMany({
    where: {
      listing: { sellerId },
    },
    include: {
      buyer: true,
      listing: true,
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function updateOrder(id, data) {
  return await prisma.order.update({
    where: { id },
    data,
    include: {
      buyer: true,
      listing: { include: { seller: true } },
    },
  });
}

export default {
  createListing,
  findListingById,
  findAllListings,
  searchListings,
  updateListing,
  deleteListing,
  createOrder,
  findOrderById,
  findOrdersByBuyer,
  findOrdersBySeller,
  updateOrder,
};
