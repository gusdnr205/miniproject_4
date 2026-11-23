// 도서 상세 화면 (담당: 최연진)
// - 책 번호(bookId)를 받아 json-server에서 그 책 정보를 불러와 보여줌
// - 장르는 숫자로 저장돼 있어서, genre 목록을 같이 불러와 이름으로 바꿔서 보여줌
//
// 주소: /books/:id  (App.jsx 라우터에 연결)
// - 주소의 :id 부분(예: /books/1 → 1)을 useParams()로 읽어서 그 책을 불러옴
// - ‹ 도서 목록 → /books,  [수정] → /books/{id}/edit
// - [삭제]는 삭제 담당이 onDelete로 연결 (받는 값: onDelete(book))
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useFetch } from '../api/useFetch';
import './BookDetailPage.css';

// 서버 주소는 각 파일에 적지 않고 .env의 VITE_API_URL 한 곳에서 관리 (useFetch가 붙여줌)

// "2026-11-20T00:00:00.000Z" → "2026.11.20"
function formatDate(iso) {
  if (!iso) return '-';
  const d = new Date(iso);
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}.${mm}.${dd}`;
}

export default function BookDetailPage({ onDelete = () => {} }) {
  const { id: bookId } = useParams();
  const navigate = useNavigate();
  const { request } = useFetch(); // 팀 공용 요청 도구
  const onBack = () => navigate('/books');
  const onEdit = () => navigate(`/books/${bookId}/edit`);

  const [book, setBook] = useState(null);
  const [genres, setGenres] = useState([]);
  // status: 'loading'(불러오는 중) | 'done'(성공) | 'notFound'(없는 책) | 'error'(서버 오류)
  const [status, setStatus] = useState('loading');
  const [retry, setRetry] = useState(0);

  useEffect(() => {
    async function load() {
      setStatus('loading');
      try {
        const [bookData, genreData] = await Promise.all([
          request(`/books/${bookId}`),
          request('/genre').catch(() => []), // 장르를 못 불러와도 상세는 보여줌
        ]);
        setBook(bookData);
        setGenres(genreData);
        setStatus('done');
      } catch (err) {
        console.error(err);
        // useFetch는 실패하면 "요청 실패 (404)"처럼 상태 번호를 담아 알려줌 → 404면 없는 책
        setStatus(err.message.includes('404') ? 'notFound' : 'error');
      }
    }
    load();
  }, [bookId, retry, request]);

  if (status === 'loading') {
    return <div className="detail-state">도서 정보를 불러오는 중이에요…</div>;
  }
  if (status === 'notFound') {
    return (
      <div className="detail-state">
        <strong>도서를 찾을 수 없어요</strong>
        <p>삭제되었거나 없는 도서예요.</p>
        <button type="button" className="detail-btn" onClick={onBack}>도서 목록으로</button>
      </div>
    );
  }
  if (status === 'error') {
    return (
      <div className="detail-state">
        <strong>도서 정보를 불러오지 못했어요</strong>
        <p>json-server가 켜져 있는지 확인하고 다시 시도해주세요.</p>
        <button type="button" className="detail-btn" onClick={() => setRetry((n) => n + 1)}>다시 시도</button>
      </div>
    );
  }

  const genreName = genres.find((g) => g.ID === Number(book.GENRE))?.GENRE_NM;

  return (
    <div className="detail-page">
      <div className="detail-topbar">
        <button type="button" className="detail-back" onClick={onBack}>‹ 도서 목록</button>
        <div className="detail-actions">
          <button type="button" className="detail-btn" onClick={onEdit}>수정</button>
          <button type="button" className="detail-btn detail-btn-danger" onClick={() => onDelete(book)}>삭제</button>
        </div>
      </div>

      <section className="detail-card">
        <div className="detail-cover-area">
          {book.COVER_IMAGE_URL ? (
            <img className="detail-cover" src={book.COVER_IMAGE_URL} alt={`${book.TITLE} 표지`} />
          ) : (
            <div className="detail-cover detail-cover-empty">표지 없음</div>
          )}
        </div>

        <div className="detail-info">
          {genreName && <span className="detail-tag">{genreName}</span>}
          <h1 className="detail-title">{book.TITLE}</h1>
          <p className="detail-author">{book.AUTHOR_NM}</p>
          <p className="detail-dates">
            작성일 {formatDate(book.CREATED_AT)}
            <span className="detail-dot">·</span>
            수정일 {formatDate(book.UPDATED_AT)}
          </p>

          <hr className="detail-divider" />

          <h2 className="detail-subtitle">책 소개</h2>
          <p className="detail-content">{book.CONTENT}</p>
        </div>
      </section>
    </div>
  );
}
