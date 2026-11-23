import { Outlet, Route, Routes, useNavigate } from 'react-router';
import Footer from './components/Footer';
import Header from './components/Header';
import LoginPage from './pages/LoginPage';
import BookListPage from './pages/BookListPage';
import BookDetailPage from './pages/BookDetailPage';
import BookNewPage from './pages/BookNewPage';
import BookEditPage from './pages/BookEditPage';

function BookLayout() {
  return (
    <>
      <Header />
      <div className="book-layout-content"><Outlet /></div>
      <Footer />
    </>
  );
}

export default function App() {
  const navigate = useNavigate();
  // 로그인 성공 시 브라우저 기록의 현재 항목을 도서 목록으로 교체한다.
  const loginPage = <LoginPage onLogin={() => navigate('/books', { replace: true })} />;

  return (
    <Routes>
      <Route path="/" element={loginPage} />
      <Route path="/login" element={loginPage} />
      <Route path="/books" element={<BookLayout />}>
        <Route index element={<BookListPage />} />
        <Route path="new" element={<BookNewPage />} />
        <Route path=":id" element={<BookDetailPage />} />
        <Route path=":id/edit" element={<BookEditPage />} />
      </Route>
    </Routes>
  );
}
