import hireRepository from "./hire.repository.js";

/**
 * Hire Service - Business Logic Layer
 */

export async function createHireRequest(requestData) {
  const { title, description, clientId, artistId } = requestData;

  if (!title || !description || !clientId || !artistId) {
    throw new Error("title, description, clientId, and artistId are required");
  }

  if (clientId === artistId) {
    throw new Error("Cannot hire yourself");
  }

  return await hireRepository.createHireRequest({
    title,
    description,
    budget: requestData.budget ? parseFloat(requestData.budget) : null,
    currency: requestData.currency || "USD",
    deadline: requestData.deadline ? new Date(requestData.deadline) : null,
    referenceImages: requestData.referenceImages || null,
    client: { connect: { id: clientId } },
    artist: { connect: { id: artistId } },
  });
}

export async function getHireRequestById(id) {
  const request = await hireRepository.findHireRequestById(id);
  if (!request) throw new Error("Hire request not found");
  return request;
}

export async function getHireRequestsByClient(clientId) {
  return await hireRepository.findHireRequestsByClient(clientId);
}

export async function getHireRequestsByArtist(artistId) {
  return await hireRepository.findHireRequestsByArtist(artistId);
}

export async function getHireRequestsByStatus(userId, status) {
  return await hireRepository.findHireRequestsByStatus(userId, status);
}

export async function respondToHireRequest(id, artistId, action, responseMessage) {
  const request = await hireRepository.findHireRequestById(id);
  if (!request) throw new Error("Hire request not found");
  if (request.artistId !== artistId) throw new Error("Not authorized");
  if (request.status !== "PENDING") throw new Error("Can only respond to pending requests");

  const statusMap = {
    accept: "ACCEPTED",
    decline: "DECLINED",
  };

  const status = statusMap[action];
  if (!status) throw new Error("Invalid action. Use 'accept' or 'decline'");

  return await hireRepository.updateHireRequest(id, {
    status,
    response: responseMessage || null,
  });
}

export async function updateHireRequestStatus(id, userId, status) {
  const request = await hireRepository.findHireRequestById(id);
  if (!request) throw new Error("Hire request not found");

  const isClient = request.clientId === userId;
  const isArtist = request.artistId === userId;
  if (!isClient && !isArtist) throw new Error("Not authorized");

  // Validate status transitions
  const validTransitions = {
    ACCEPTED: ["IN_PROGRESS", "CANCELLED"],
    IN_PROGRESS: ["COMPLETED", "CANCELLED"],
  };

  const allowed = validTransitions[request.status];
  if (!allowed || !allowed.includes(status)) {
    throw new Error(`Cannot transition from ${request.status} to ${status}`);
  }

  if (status === "CANCELLED" && !isClient) {
    throw new Error("Only client can cancel");
  }

  if (["IN_PROGRESS", "COMPLETED"].includes(status) && !isArtist) {
    throw new Error("Only artist can mark as in-progress or completed");
  }

  return await hireRepository.updateHireRequest(id, { status });
}

export async function cancelHireRequest(id, clientId) {
  const request = await hireRepository.findHireRequestById(id);
  if (!request) throw new Error("Hire request not found");
  if (request.clientId !== clientId) throw new Error("Not authorized");
  if (["COMPLETED", "CANCELLED", "DECLINED"].includes(request.status)) {
    throw new Error("Cannot cancel this request");
  }

  return await hireRepository.updateHireRequest(id, { status: "CANCELLED" });
}

export default {
  createHireRequest,
  getHireRequestById,
  getHireRequestsByClient,
  getHireRequestsByArtist,
  getHireRequestsByStatus,
  respondToHireRequest,
  updateHireRequestStatus,
  cancelHireRequest,
};
