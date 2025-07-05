import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import useApi from '../hooks/useApi';
import apiService from '../services/apiService';

function PostForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: '',
    featuredImage: null,
  });
  const [categories, setCategories] = useState([]);
  const { loading, error, fetchData } = useApi();

  useEffect(() => {
    fetchCategories();
    if (id) fetchPost();
  }, [id]);

  const fetchCategories = async () => {
    const data = await fetchData(apiService.getCategories);
    if (data) setCategories(data);
  };

  const fetchPost = async () => {
    const data = await fetchData(() => apiService.getPost(id));
    if (data) {
      setFormData({
        title: data.title,
        content: data.content,
        category: data.category._id,
        featuredImage: null,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData();
    form.append('title', formData.title);
    form.append('content', formData.content);
    form.append('category', formData.category);
    if (formData.featuredImage) form.append('featuredImage', formData.featuredImage);

    const success = await fetchData(() =>
      id ? apiService.updatePost(id, form) : apiService.createPost(form)
    );

    if (success) {
      toast.success(`Post ${id ? 'updated' : 'created'} successfully`);
      navigate('/');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({ ...prev, featuredImage: e.target.files[0] }));
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <form onSubmit={handleSubmit}>
      <h1>{id ? 'Edit Post' : 'Create Post'}</h1>
      <div>
        <label>Title</label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleInputChange}
          required
        />
      </div>
      <div>
        <label>Content</label>
        <textarea
          name="content"
          value={formData.content}
          onChange={handleInputChange}
          required
        />
      </div>
      <div>
        <label>Category</label>
        <select name="category" value={formData.category} onChange={handleInputChange} required>
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label>Featured Image</label>
        <input type="file" accept="image/*" onChange={handleFileChange} />
      </div>
      <button type="submit">{id ? 'Update' : 'Create'} Post</button>
    </form>
  );
}

export default PostForm;