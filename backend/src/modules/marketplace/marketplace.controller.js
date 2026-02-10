import marketplaceService from "./marketplace.service.js";

/**
 * Marketplace Controller - HTTP Request Handler
 */

// ===== LISTING endpoints =====

export async function createListing(req, res) {
  try {
    const listing = await marketplaceService.createListing(req.body);
    res.status(201).json(listing);
  } catch (error) {
    console.error("Error creating listing:", error);
    res.status(400).json({ error: "Error creating listing", details: error.message });
  }
}

export async function getListingById(req, res) {
  try {
    const listing = await marketplaceService.getListingById(req.params.id);
    res.status(200).json(listing);
  } catch (error) {
    console.error("Error fetching listing:", error);
    res.status(error.message === "Listing not found" ? 404 : 500).json({
      error: "Error fetching listing", details: error.message,
    });
  }
}

export async function getAllListings(req, res) {
  try {
    const result = await marketplaceService.getAllListings(req.query);
    res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching listings:", error);
    res.status(500).json({ error: "Error fetching listings", details: error.message });
  }
}

export async function searchListings(req, res) {
  try {
    const { q } = req.query;
    const listings = await marketplaceService.searchListings(q);
    res.status(200).json(listings);
  } catch (error) {
    console.error("Error searching listings:", error);
    res.status(400).json({ error: "Error searching listings", details: error.message });
  }
}

export async function updateListing(req, res) {
  try {
    const { sellerId, ...updateData } = req.body;
    const listing = await marketplaceService.updateListing(req.params.id, sellerId, updateData);
    res.status(200).json(listing);
  } catch (error) {
    console.error("Error updating listing:", error);
    const status = error.message.includes("Not authorized") ? 403 : error.message === "Listing not found" ? 404 : 400;
    res.status(status).json({ error: "Error updating listing", details: error.message });
  }
}

export async function deleteListing(req, res) {
  try {
    const { sellerId } = req.body;
    await marketplaceService.deleteListing(req.params.id, sellerId);
    res.status(204).send();
  } catch (error) {
    console.error("Error deleting listing:", error);
    const status = error.message.includes("Not authorized") ? 403 : error.message === "Listing not found" ? 404 : 500;
    res.status(status).json({ error: "Error deleting listing", details: error.message });
  }
}

// ===== ORDER endpoints =====

export async function createOrder(req, res) {
  try {
    const order = await marketplaceService.createOrder(req.body);
    res.status(201).json(order);
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(400).json({ error: "Error creating order", details: error.message });
  }
}

export async function getOrderById(req, res) {
  try {
    const order = await marketplaceService.getOrderById(req.params.id);
    res.status(200).json(order);
  } catch (error) {
    console.error("Error fetching order:", error);
    res.status(error.message === "Order not found" ? 404 : 500).json({
      error: "Error fetching order", details: error.message,
    });
  }
}

export async function getOrdersByBuyer(req, res) {
  try {
    const orders = await marketplaceService.getOrdersByBuyer(req.params.buyerId);
    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching buyer orders:", error);
    res.status(500).json({ error: "Error fetching orders", details: error.message });
  }
}

export async function getOrdersBySeller(req, res) {
  try {
    const orders = await marketplaceService.getOrdersBySeller(req.params.sellerId);
    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching seller orders:", error);
    res.status(500).json({ error: "Error fetching orders", details: error.message });
  }
}

export async function updateOrderStatus(req, res) {
  try {
    const { userId, status } = req.body;
    const order = await marketplaceService.updateOrderStatus(req.params.id, userId, status);
    res.status(200).json(order);
  } catch (error) {
    console.error("Error updating order status:", error);
    const status = error.message.includes("Not authorized") ? 403 : 400;
    res.status(status).json({ error: "Error updating order", details: error.message });
  }
}

export default {
  createListing,
  getListingById,
  getAllListings,
  searchListings,
  updateListing,
  deleteListing,
  createOrder,
  getOrderById,
  getOrdersByBuyer,
  getOrdersBySeller,
  updateOrderStatus,
};
