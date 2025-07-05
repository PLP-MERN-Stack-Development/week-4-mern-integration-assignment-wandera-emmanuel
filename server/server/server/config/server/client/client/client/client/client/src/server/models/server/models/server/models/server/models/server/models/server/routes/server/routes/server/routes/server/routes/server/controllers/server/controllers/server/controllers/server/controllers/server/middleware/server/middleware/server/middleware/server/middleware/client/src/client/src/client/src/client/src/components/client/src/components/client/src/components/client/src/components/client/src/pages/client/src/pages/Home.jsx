import { useState, useEffect } from 'react';
import PostList from '../components/PostList';
import useApi from '../hooks/useApi';
import apiService from '../services/apiService';

function Home() {
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [filters, setFilters] = useState({ search: '', category: '' });
  const { loading, error, fetchData } = useApi();

  useEffect(() => {
    fetchPosts();
    fetchCategories();
  }, [page, filters]);

  const fetchPosts = async () => {
    const data = await fetchData(() => apiService.getPosts(page, filters));
    if (data) {
      setPosts(data.posts);
      setTotal(data.total);
    }
  };

  const fetchCategories = async () => {
    const data = await fetchData(apiService.getCategories);
    if (data) setCategories(data);
  };

  const handleFilter = (newFilters) => {
    setFilters(newFilters);
    setPage(1);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>Blog Posts</h1>
      <PostList posts={posts} categories={categories} onFilter={handleFilter} />
      <div>
        <button
          disabled={page === 1}
          onClick={() => setPage((prev) => prev - 1)}
        >
          Previous
        </button>
        <button
          disabled={page * 10 >= total}
          onClick={() => setPage((prev) => prev + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default Home;