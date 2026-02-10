import marketplaceRepository from "./marketplace.repository.js";

/**
 * Marketplace Service - Business Logic Layer
 */

// ===== LISTING services =====

export async function createListing(listingData) {
  const { title, imageUrl, price, sellerId } = listingData;

  if (!title || !imageUrl || !price || !sellerId) {
    throw new Error("title, imageUrl, price, and sellerId are required");
  }

  if (price <= 0) {
    throw new Error("Price must be greater than zero");
  }

  return await marketplaceRepository.createListing({
    title: listingData.title,
    description: listingData.description,
    imageUrl: listingData.imageUrl,
    price: parseFloat(listingData.price),
    currency: listingData.currency || "USD",
    category: listingData.category,
    medium: listingData.medium,
    seller: { connect: { id: sellerId } },
    ...(listingData.postId && { post: { connect: { id: listingData.postId } } }),
  });
}

export async function getListingById(id) {
  const listing = await marketplaceRepository.findListingById(id);
  if (!listing) throw new Error("Listing not found");
  return listing;
}

export async function getAllListings(filters = {}) {
  return await marketplaceRepository.findAllListings({
    status: filters.status || "AVAILABLE",
    category: filters.category,
    medium: filters.medium,
    minPrice: filters.minPrice ? parseFloat(filters.minPrice) : undefined,
    maxPrice: filters.maxPrice ? parseFloat(filters.maxPrice) : undefined,
    sellerId: filters.sellerId,
    limit: parseInt(filters.limit, 10) || 20,
    page: parseInt(filters.page, 10) || 1,
  });
}

export async function searchListings(query) {
  if (!query) throw new Error("Search query is required");
  return await marketplaceRepository.searchListings(query);
}

export async function updateListing(id, sellerId, updateData) {
  const listing = await marketplaceRepository.findListingById(id);
  if (!listing) throw new Error("Listing not found");
  if (listing.sellerId !== sellerId) throw new Error("Not authorized to update this listing");

  const data = {};
  if (updateData.title) data.title = updateData.title;
  if (updateData.description !== undefined) data.description = updateData.description;
  if (updateData.price) data.price = parseFloat(updateData.price);
  if (updateData.category) data.category = updateData.category;
  if (updateData.medium) data.medium = updateData.medium;
  if (updateData.imageUrl) data.imageUrl = updateData.imageUrl;
  if (updateData.status) data.status = updateData.status;

  return await marketplaceRepository.updateListing(id, data);
}

export async function deleteListing(id, sellerId) {
  const listing = await marketplaceRepository.findListingById(id);
  if (!listing) throw new Error("Listing not found");
  if (listing.sellerId !== sellerId) throw new Error("Not authorized to delete this listing");

  return await marketplaceRepository.deleteListing(id);
}

// ===== ORDER services =====

export async function createOrder(orderData) {
  const { buyerId, listingId } = orderData;
  if (!buyerId || !listingId) throw new Error("buyerId and listingId are required");

  const listing = await marketplaceRepository.findListingById(listingId);
  if (!listing) throw new Error("Listing not found");
  if (listing.status !== "AVAILABLE") throw new Error("Listing is no longer available");
  if (listing.sellerId === buyerId) throw new Error("Cannot buy your own listing");

  const order = await marketplaceRepository.createOrder({
    total: listing.price * (orderData.quantity || 1),
    quantity: orderData.quantity || 1,
    note: orderData.note,
    buyer: { connect: { id: buyerId } },
    listing: { connect: { id: listingId } },
  });

  // Mark listing as sold
  await marketplaceRepository.updateListing(listingId, { status: "SOLD" });

  return order;
}

export async function getOrderById(id) {
  const order = await marketplaceRepository.findOrderById(id);
  if (!order) throw new Error("Order not found");
  return order;
}

export async function getOrdersByBuyer(buyerId) {
  return await marketplaceRepository.findOrdersByBuyer(buyerId);
}

export async function getOrdersBySeller(sellerId) {
  return await marketplaceRepository.findOrdersBySeller(sellerId);
}

export async function updateOrderStatus(id, userId, status) {
  const order = await marketplaceRepository.findOrderById(id);
  if (!order) throw new Error("Order not found");

  // Only seller can confirm/ship/deliver, buyer can cancel
  const isSeller = order.listing.sellerId === userId;
  const isBuyer = order.buyerId === userId;

  if (!isSeller && !isBuyer) throw new Error("Not authorized");

  if (status === "CANCELLED" && !isBuyer) throw new Error("Only buyer can cancel");
  if (["CONFIRMED", "SHIPPED", "DELIVERED"].includes(status) && !isSeller) {
    throw new Error("Only seller can update order status");
  }

  return await marketplaceRepository.updateOrder(id, { status });
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
