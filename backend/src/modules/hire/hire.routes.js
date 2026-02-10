import express from "express";
import hireController from "./hire.controller.js";

const router = express.Router();

/**
 * Hire Routes - Artist Hiring / Commission Requests
 */

// POST /api/hire - Create hire request
router.post("/", hireController.createHireRequest);

// GET /api/hire/:id - Get hire request by ID
router.get("/:id", hireController.getHireRequestById);

// GET /api/hire/client/:clientId - Get requests sent by client
router.get("/client/:clientId", hireController.getHireRequestsByClient);

// GET /api/hire/artist/:artistId - Get requests received by artist
router.get("/artist/:artistId", hireController.getHireRequestsByArtist);

// PUT /api/hire/:id/respond - Artist accepts or declines
router.put("/:id/respond", hireController.respondToHireRequest);

// PUT /api/hire/:id/status - Update hire request status
router.put("/:id/status", hireController.updateHireRequestStatus);

// PUT /api/hire/:id/cancel - Client cancels hire request
router.put("/:id/cancel", hireController.cancelHireRequest);

export default router;
