import { useState, useEffect } from 'react';
import postAPI from '../api/post.api';

// Fetch and manage posts with filter (recent/popular)
export const usePosts = (filter = 'recent') => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      setError(null);

      let data;
      switch (filter) {
        case 'popular':
          data = await postAPI.getPopularPosts();
          break;
        case 'recent':
        default:
          data = await postAPI.getRecentPosts();
          break;
      }

      setPosts(data);
    } catch (err) {
      console.error('Error fetching posts:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [filter]);

  return { posts, loading, error, refetch: fetchPosts };
};

// Fetch a single post by ID
export const usePost = (postId) => {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPost = async () => {
    if (!postId) return;

    try {
      setLoading(true);
      setError(null);
      const data = await postAPI.getPostById(postId);
      setPost(data);
    } catch (err) {
      console.error('Error fetching post:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPost();
  }, [postId]);

  return { post, loading, error, refetch: fetchPost };
};
