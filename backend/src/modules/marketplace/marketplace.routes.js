import express from "express";
import marketplaceController from "./marketplace.controller.js";

const router = express.Router();

/**
 * Marketplace Routes - Listings & Orders
 */

// ===== LISTING routes =====

// GET /api/marketplace/listings - Get all listings (with filters)
router.get("/listings", marketplaceController.getAllListings);

// GET /api/marketplace/listings/search?q=... - Search listings
router.get("/listings/search", marketplaceController.searchListings);

// GET /api/marketplace/listings/:id - Get listing by ID
router.get("/listings/:id", marketplaceController.getListingById);

// POST /api/marketplace/listings - Create new listing
router.post("/listings", marketplaceController.createListing);

// PUT /api/marketplace/listings/:id - Update listing
router.put("/listings/:id", marketplaceController.updateListing);

// DELETE /api/marketplace/listings/:id - Delete listing
router.delete("/listings/:id", marketplaceController.deleteListing);

// ===== ORDER routes =====

// POST /api/marketplace/orders - Create order (buy artwork)
router.post("/orders", marketplaceController.createOrder);

// GET /api/marketplace/orders/:id - Get order by ID
router.get("/orders/:id", marketplaceController.getOrderById);

// GET /api/marketplace/orders/buyer/:buyerId - Get orders by buyer
router.get("/orders/buyer/:buyerId", marketplaceController.getOrdersByBuyer);

// GET /api/marketplace/orders/seller/:sellerId - Get orders by seller
router.get("/orders/seller/:sellerId", marketplaceController.getOrdersBySeller);

// PUT /api/marketplace/orders/:id/status - Update order status
router.put("/orders/:id/status", marketplaceController.updateOrderStatus);

export default router;
