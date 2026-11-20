import { useState, useEffect } from 'react';
import './App.css'
import Header from './components/Header';
import PostItem from './components/PostItem';
import PostList from './components/PostList';
import LikeButton from './components/LikeButton';
import NameInput from './components/NameInput';
import PostForm from './components/PostForm';
import { useFetch } from './api/useFetch';

function App() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { request } = useFetch();

  const handleDelete = async (id) => {
    try {
      await request(`/posts/${id}`, {
        method: 'DELETE'
      })

      setPosts(posts.filter((p) => p.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddPost = async (newPost) => {
    try {
      const saved = await request('/books', {
        method: 'POST',
        body: newPost
      });

      setPosts([...posts, saved]);
    } catch (err) {
      console.error(err);
    }
  };

  const handleLike = async (id) => {
    try {
      const post = posts.find((p) => p.id === id);
      const updated = await request(`/books/${id}`, {
        method: 'PATCH',
        body: { likes: post.likes + 1 }
      });

      setPosts(posts.map((p) => p.id === id ? updated : p));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    async function loadPosts() {
      try {
        const data = await request('/books');
        setPosts(data);
      } catch (err) {
        console.error(err);
        setError('게시글을 불러오지 못했어요.');
      }

      setLoading(false);
    }
    loadPosts();
  }, [request]);

  if (loading) {
    return (
      <>
        <Header />
        <p>불러오는 중...</p>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Header />
        <p>에러: {error}</p>
      </>
    );
  }

  return (
    <>
      <Header />
      {/* <NameInput /> */}
      <main>
        <PostForm onAddPost={handleAddPost} />
        {/* <LikeButton /> */}
        {/* <button onClick={() => handleLike()}>
          첫 글 좋아요 (실험) {posts[0].likes}</button> */}

        <PostList posts={posts} onLike={handleLike} onDelete={handleDelete} />
      </main>
    </>
  )
}

export default App
