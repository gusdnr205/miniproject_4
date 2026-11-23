import { Route, Routes, useNavigate } from 'react-router';
import PostListPage from './pages/PostListPage';
import LoginPage from './pages/LoginPage';
import BookListPage from './pages/BookListPage';

export default function App() {
  const navigate = useNavigate();
  // 로그인 성공 시 브라우저 기록의 현재 항목을 도서 목록으로 교체한다.
  const loginPage = <LoginPage onLogin={() => navigate('/books', { replace: true })} />;

  // 화면을 구현하면 해당 Route의 element에 페이지 컴포넌트를 연결한다.
  return (
    <Routes>
      <Route path="/" element={loginPage} />
      <Route path="/login" element={loginPage} />
      {/* <Route path="/books" element={<PostListPage />} /> */}
      <Route path="/books" element={<BookListPage />} /> 
  
      <Route path="/books/new" element={<h1>도서 등록</h1>} />
      {/* 목록에서 navigate(`/books/${book.ID}`)를 호출하면 상세 화면으로 이동한다. */}
      <Route path="/books/:id" element={<h1>도서 상세</h1>} />
      {/* 상세 화면에서 const { id } = useParams()로 ID를 읽고 navigate(`/books/${id}/edit`)로 이동한다. */}
      <Route path="/books/:id/edit" element={<h1>도서 수정</h1>} />
    </Routes>
  );
}
