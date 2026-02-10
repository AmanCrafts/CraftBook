import hireService from "./hire.service.js";

/**
 * Hire Controller - HTTP Request Handler
 */

export async function createHireRequest(req, res) {
  try {
    const request = await hireService.createHireRequest(req.body);
    res.status(201).json(request);
  } catch (error) {
    console.error("Error creating hire request:", error);
    res.status(400).json({ error: "Error creating hire request", details: error.message });
  }
}

export async function getHireRequestById(req, res) {
  try {
    const request = await hireService.getHireRequestById(req.params.id);
    res.status(200).json(request);
  } catch (error) {
    console.error("Error fetching hire request:", error);
    res.status(error.message === "Hire request not found" ? 404 : 500).json({
      error: "Error fetching hire request", details: error.message,
    });
  }
}

export async function getHireRequestsByClient(req, res) {
  try {
    const requests = await hireService.getHireRequestsByClient(req.params.clientId);
    res.status(200).json(requests);
  } catch (error) {
    console.error("Error fetching client hire requests:", error);
    res.status(500).json({ error: "Error fetching hire requests", details: error.message });
  }
}

export async function getHireRequestsByArtist(req, res) {
  try {
    const requests = await hireService.getHireRequestsByArtist(req.params.artistId);
    res.status(200).json(requests);
  } catch (error) {
    console.error("Error fetching artist hire requests:", error);
    res.status(500).json({ error: "Error fetching hire requests", details: error.message });
  }
}

export async function respondToHireRequest(req, res) {
  try {
    const { artistId, action, response: responseMessage } = req.body;
    const request = await hireService.respondToHireRequest(req.params.id, artistId, action, responseMessage);
    res.status(200).json(request);
  } catch (error) {
    console.error("Error responding to hire request:", error);
    const status = error.message.includes("Not authorized") ? 403 : 400;
    res.status(status).json({ error: "Error responding to hire request", details: error.message });
  }
}

export async function updateHireRequestStatus(req, res) {
  try {
    const { userId, status } = req.body;
    const request = await hireService.updateHireRequestStatus(req.params.id, userId, status);
    res.status(200).json(request);
  } catch (error) {
    console.error("Error updating hire request status:", error);
    const status = error.message.includes("Not authorized") ? 403 : 400;
    res.status(status).json({ error: "Error updating hire request", details: error.message });
  }
}

export async function cancelHireRequest(req, res) {
  try {
    const { clientId } = req.body;
    const request = await hireService.cancelHireRequest(req.params.id, clientId);
    res.status(200).json(request);
  } catch (error) {
    console.error("Error cancelling hire request:", error);
    const status = error.message.includes("Not authorized") ? 403 : 400;
    res.status(status).json({ error: "Error cancelling hire request", details: error.message });
  }
}

export default {
  createHireRequest,
  getHireRequestById,
  getHireRequestsByClient,
  getHireRequestsByArtist,
  respondToHireRequest,
  updateHireRequestStatus,
  cancelHireRequest,
};
