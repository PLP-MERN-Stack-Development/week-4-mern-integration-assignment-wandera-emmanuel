import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import useApi from '../hooks/useApi';
import apiService from '../services/apiService';
import AuthContext from '../context/AuthContext';

function PostDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [post, setPost] = useState(null);
  const [comment, setComment] = useState('');
  const { loading, error, fetchData } = useApi();

  useEffect(() => {
    fetchPost();
  }, [id]);

  const fetchPost = async () => {
    const data = await fetchData(() => apiService.getPost(id));
    if (data) setPost(data);
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      const success = await fetchData(() => apiService.deletePost(id));
      if (success) {
        toast.success('Post deleted successfully');
        navigate('/');
      }
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    const success = await fetchData(() => apiService.addComment(id, { content: comment }));
    if (success) {
      setComment('');
      fetchPost();
      toast.success('Comment added');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!post) return null;

  return (
    <div>
      {post.featuredImage && (
        <img src={post.featuredImage} alt={post.title} style={{ maxWidth: '400px' }} />
      )}
      <h1>{post.title}</h1>
      <p>{post.content}</p>
      <p>Category: {post.category?.name}</p>
      <p>Author: {post.author?.username}</p>
      {user && user.id === post.author?._id && (
        <div>
          <Link to={`/posts/edit/${post._id}`}>Edit</Link>
          <button onClick={handleDelete}>Delete</button>
        </div>
      )}
      <h3>Comments</h3>
      {post.comments?.map((comment) => (
        <div key={comment._id} style={{ border: '1px solid #ddd', padding: '1rem', marginBottom: '1rem' }}>
          <p>{comment.content}</p>
          <p>By: {comment.author?.username}</p>
        </div>
      ))}
      {user && (
        <form onSubmit={handleComment}>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Add a comment..."
            required
          />
          <button type="submit">Post Comment</button>
        </form>
      )}
    </div>
  );
}

export default PostDetail;