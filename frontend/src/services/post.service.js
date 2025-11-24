import postAPI from "../api/post.api";

// Post service - handles post-related business logic

// Create a new post
export async function createPost(postData) {
  try {
    // Validate required fields
    if (!postData.title || !postData.imageUrl || !postData.authorId) {
      throw new Error("Missing required fields");
    }

    // Process tags
    let tags = postData.tags;
    if (Array.isArray(tags)) {
      tags = tags.join(",");
    }

    const post = await postAPI.createPost({
      ...postData,
      tags,
    });

    return { success: true, data: post };
  } catch (error) {
    console.error("Create post error:", error);
    return { success: false, error: error.message };
  }
}

// Update an existing post
export async function updatePost(postId, updates) {
  try {
    const post = await postAPI.updatePost(postId, updates);
    return { success: true, data: post };
  } catch (error) {
    console.error("Update post error:", error);
    return { success: false, error: error.message };
  }
}

// Delete a post
export async function deletePost(postId) {
  try {
    await postAPI.deletePost(postId);
    return { success: true };
  } catch (error) {
    console.error("Delete post error:", error);
    return { success: false, error: error.message };
  }
}

// Get posts with pagination
export async function getPosts(page = 1, limit = 10) {
  try {
    // This would require pagination support in the API
    const posts = await postAPI.getAllPosts();

    // Client-side pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedPosts = posts.slice(startIndex, endIndex);

    return {
      success: true,
      data: paginatedPosts,
      pagination: {
        page,
        limit,
        total: posts.length,
        hasMore: endIndex < posts.length,
      },
    };
  } catch (error) {
    console.error("Get posts error:", error);
    return { success: false, error: error.message };
  }
}

// Default export for compatibility
export default {
  createPost,
  updatePost,
  deletePost,
  getPosts,
};
