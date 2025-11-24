import { supabase } from "../../config/supabase.js";
import { prisma } from "../../config/database.js";
import config from "../../config/index.js";

/**
 * Upload Service - Business Logic Layer
 * Handles file uploads to Supabase Storage
 */

/**
 * Upload image to Supabase Storage
 */
export async function uploadImage(file) {
  if (!file) {
    throw new Error("No file provided");
  }

  const fileName = `${Date.now()}-${file.originalname}`;
  const bucketName = config.supabase.bucketName;

  try {
    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(fileName, file.buffer, {
        contentType: file.mimetype,
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      console.error("Supabase upload error:", error);
      throw new Error(`Failed to upload image to storage: ${error.message}`);
    }

    // Get public URL
    const { data: publicUrlData } = supabase.storage
      .from(bucketName)
      .getPublicUrl(fileName);

    const publicUrl = publicUrlData.publicUrl;

    // Save the URL to database
    const image = await prisma.image.create({
      data: {
        name: file.originalname,
        url: publicUrl,
      },
    });

    return {
      success: true,
      image,
      message: "Image uploaded successfully",
    };
  } catch (error) {
    console.error("Upload error:", error);
    throw error;
  }
}

/**
 * Delete image from Supabase Storage
 */
export async function deleteImage(imageId) {
  try {
    // Get image from database
    const image = await prisma.image.findUnique({
      where: { id: imageId },
    });

    if (!image) {
      throw new Error("Image not found");
    }

    // Extract filename from URL
    const urlParts = image.url.split("/");
    const fileName = urlParts[urlParts.length - 1];
    const bucketName = config.supabase.bucketName;

    // Delete from Supabase Storage
    const { error } = await supabase.storage
      .from(bucketName)
      .remove([fileName]);

    if (error) {
      console.error("Supabase delete error:", error);
      throw new Error(`Failed to delete image from storage: ${error.message}`);
    }

    // Delete from database
    await prisma.image.delete({
      where: { id: imageId },
    });

    return {
      success: true,
      message: "Image deleted successfully",
    };
  } catch (error) {
    console.error("Delete error:", error);
    throw error;
  }
}

// Default export for compatibility
export default {
  uploadImage,
  deleteImage,
};
