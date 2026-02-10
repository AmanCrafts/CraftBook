import { prisma } from "../../config/database.js";

/**
 * Hire Repository - Data Access Layer
 * Handles all database operations for hire requests
 */

export async function createHireRequest(data) {
  return await prisma.hireRequest.create({
    data,
    include: {
      client: true,
      artist: true,
    },
  });
}

export async function findHireRequestById(id) {
  return await prisma.hireRequest.findUnique({
    where: { id },
    include: {
      client: true,
      artist: true,
    },
  });
}

export async function findHireRequestsByClient(clientId) {
  return await prisma.hireRequest.findMany({
    where: { clientId },
    include: {
      artist: true,
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function findHireRequestsByArtist(artistId) {
  return await prisma.hireRequest.findMany({
    where: { artistId },
    include: {
      client: true,
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function findHireRequestsByStatus(userId, status) {
  return await prisma.hireRequest.findMany({
    where: {
      OR: [{ clientId: userId }, { artistId: userId }],
      status,
    },
    include: {
      client: true,
      artist: true,
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function updateHireRequest(id, data) {
  return await prisma.hireRequest.update({
    where: { id },
    data,
    include: {
      client: true,
      artist: true,
    },
  });
}

export async function deleteHireRequest(id) {
  return await prisma.hireRequest.delete({ where: { id } });
}

export default {
  createHireRequest,
  findHireRequestById,
  findHireRequestsByClient,
  findHireRequestsByArtist,
  findHireRequestsByStatus,
  updateHireRequest,
  deleteHireRequest,
};
