import { useState, useEffect } from 'react';
import './App.css'
import Header from './components/Header';
import PostItem from './components/PostItem';
import PostList from './components/PostList';
import LikeButton from './components/LikeButton';
import NameInput from './components/NameInput';
import PostForm from './components/PostForm';

function App() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleDelete = async (id) => {
    try {
      await fetch(`http://localhost:3000/posts/${id}`, {
        method: 'DELETE'
      })

      setPosts(posts.filter((p) => p.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddPost = async (newPost) => {
    try {
      const res = await fetch('http://localhost:3000/books', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPost)
      });
      const saved = await res.json();

      setPosts([...posts, saved]);
    } catch (err) {
      console.error(err);
    }
  };

  const handleLike = async (id) => {
    try {
      const post = posts.find((p) => p.id === id);
      const res = await fetch(`http://localhost:3000/books/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ likes: post.likes + 1 })
      })
      const updated = await res.json();

      setPosts(posts.map((p) => p.id === id ? updated : p));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    async function loadPosts() {
      try {
        const res = await fetch('http://localhost:3000/books');
        const data = await res.json();
        setPosts(data);
      } catch (err) {
        console.error(err);
        setError('게시글을 불러오지 못했어요.');
      }

      setLoading(false);
    }
    loadPosts();
  }, []);

  /*async function loadPosts() {
    const res = await fetch('http://localhost:3000/posts');
    const data = await res.json();
    setPosts(data);
  }

  loadPosts();*/

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
