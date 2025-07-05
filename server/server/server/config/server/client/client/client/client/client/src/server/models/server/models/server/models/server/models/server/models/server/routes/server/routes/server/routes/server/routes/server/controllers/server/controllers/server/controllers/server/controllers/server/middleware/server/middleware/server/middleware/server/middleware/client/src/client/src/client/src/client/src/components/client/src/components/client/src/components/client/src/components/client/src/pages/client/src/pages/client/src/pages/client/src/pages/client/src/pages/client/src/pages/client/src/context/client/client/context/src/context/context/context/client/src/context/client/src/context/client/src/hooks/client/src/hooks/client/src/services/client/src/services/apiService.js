import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const apiService = {
  getPosts: async (page = 1, { search, category }) => {
    const params = { page, limit: 10 };
    if (search) params.search = search;
    if (category) params.category = category;
    return api.get('/posts', { params });
  },
  getPost: (id) => api.get(`/posts/${id}`),
  createPost: (data) => api.post('/posts', data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  updatePost: (id, data) => api.put(`/posts/${id}`, data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  deletePost: (id) => api.delete(`/posts/${id}`),
  getCategories: () => api.get('/categories'),
  createCategory: (data) => api.post('/categories', data),
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  addComment: (postId, data) => api.post(`/posts/${postId}/comments`, data),
};

export default apiService;