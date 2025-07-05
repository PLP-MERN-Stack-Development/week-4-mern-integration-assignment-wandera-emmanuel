import { Link } from 'react-router-dom';
import { useState } from 'react';

function PostList({ posts, categories, onFilter }) {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');

  const handleFilter = () => {
    onFilter({ search, category });
  };

  return (
    <div>
      <div style={{ marginBottom: '1rem' }}>
        <input
          type="text"
          placeholder="Search posts..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.name}
            </option>
          ))}
        </select>
        <button onClick={handleFilter}>Filter</button>
      </div>
      {posts.map((post) => (
        <div key={post._id} style={{ border: '1px solid #ddd', padding: '1rem', marginBottom: '1rem' }}>
          {post.featuredImage && (
            <img src={post.featuredImage} alt={post.title} style={{ maxWidth: '200px' }} />
          )}
          <h2>
            <Link to={`/posts/${post._id}`}>{post.title}</Link>
          </h2>
          <p>{post.content.substring(0, 100)}...</p>
          <p>Category: {post.category?.name}</p>
          <p>Author: {post.author?.username}</p>
        </div>
      ))}
    </div>
  );
}

export default PostList;