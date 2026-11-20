
/* 서진: 목업용 코드

// ⚠️ 내 컴퓨터에서 화면 확인용
// 커밋하지 말기!!!!!!!!!
// 확인할 때 src/App.jsx 내용을 이 파일 내용으로 바꾸고,
// 끝나면 `git restore src/App.jsx` 로 원래대로 

import { useState, useEffect } from 'react';
import Header from './components/Header';
import BookList from './components/BookList';
import Footer from './components/Footer';

function App() {
  const [books, setBooks] = useState([]);
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        const [bookRes, genreRes] = await Promise.all([
          fetch('http://localhost:3000/books'),
          fetch('http://localhost:3000/genre'),
        ]);
        setBooks(await bookRes.json());
        setGenres(await genreRes.json());
      } catch (err) {
        console.error(err);
        setError('도서를 불러오지 못했어요.');
      }
      setLoading(false);
    }
    load();
  }, []);

  return (
    <>
      <Header
        currentPage="list"
        onNavigate={(page) => console.log('이동:', page)}
      />
      <main>
        {loading && <p>불러오는 중...</p>}
        {error && <p>에러: {error}</p>}
        {!loading && !error && (
          <BookList
            books={books}
            genres={genres}
            onSelectBook={(id) => console.log('상세로 이동:', id)}
            onCreate={() => console.log('등록 화면으로 이동')}
          />
        )}
      </main>
      <Footer />
    </>
  );
}

export default App;
*/




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
