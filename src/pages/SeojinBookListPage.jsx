// 위치: src/pages/BookListPage.jsx
// 역할: '/books' 주소에서 보이는 메인(도서 목록) 화면 전체

import { useState, useEffect } from 'react'; // state(화면이 기억하는 값)와 effect(화면이 뜬 뒤 실행할 일)
import { useNavigate } from 'react-router'; // 주소를 바꿔서 다른 화면으로 이동시키는 함수
import Header from '../components/Header';
import BookList from '../components/BookList';
import Footer from '../components/Footer';
import { useFetch } from '../api/useFetch'; // 팀장이 만든 서버 요청 도구

export default function BookListPage() {
  const navigate = useNavigate(); // 이동 함수: navigate('/books/new')처럼 사용
  const { request } = useFetch(); // 서버에 요청하는 함수: request('/books')

  const [books, setBooks] = useState([]); // 도서 목록 (처음엔 빈 배열)
  const [genres, setGenres] = useState([]); // 장르 목록 (장르 이름 표시·필터용)
  const [loading, setLoading] = useState(true); // 불러오는 중인지
  const [error, setError] = useState(null); // 불러오기 실패 메시지

//   화면이 처음 뜰 때 한 번 실행: 도서와 장르를 서버에서 가져옴
  useEffect(() => {
    async function load() {
      try {
        // 두 요청을 동시에 보내고 둘 다 끝나면 결과를 받음
        const [bookData, genreData] = await Promise.all([
          request('/books'),
          request('/genre'),
        ]);
        setBooks(bookData); // 받은 도서를 state에 저장 → 화면이 다시 그려짐
        setGenres(genreData);
      } catch (err) {
        console.error(err); // 개발자 도구 콘솔에 에러 기록
        setError('도서를 불러오지 못했어요.');
      }
      setLoading(false); // 성공하든 실패하든 '불러오는 중' 상태는 끝
    }
    load();
  }, [request]); // request가 바뀔 때만 다시 실행 (useFetch가 고정해 두어 사실상 한 번만 실행됨)


  return (
    <>
      <Header />
      <main>
        {loading && <p>불러오는 중...</p>}
        {error && <p>에러: {error}</p>}
        {!loading && !error && (
          <BookList
            books={books}
            genres={genres}
            onSelectBook={(id) => navigate(`/books/${id}`)} // 카드 클릭 → 상세 화면
            onCreate={() => navigate('/books/new')} // '새 도서 등록' 클릭 → 등록 화면
          />
        )}
      </main>
      <Footer />
    </>
  );
}