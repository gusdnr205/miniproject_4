// 도서 상세 화면 (담당: 최연진)
// - 책 번호(bookId)를 받아 json-server에서 그 책 정보를 불러와 보여줌
// - 장르는 숫자로 저장돼 있어서, genre 목록을 같이 불러와 이름으로 바꿔서 보여줌
//
// 받는 값(props)
//   bookId   : 보여줄 책의 ID
//   onBack   : "‹ 도서 목록"을 눌렀을 때 → onBack()
//   onEdit   : [수정]을 눌렀을 때 → onEdit(book)
//   onDelete : [삭제]를 눌렀을 때 → onDelete(book)
import { useEffect, useState } from 'react';
import './BookDetailPage.css';

const API_URL = 'http://127.0.0.1:3000';

// "2026-11-20T00:00:00.000Z" → "2026.11.20"
function formatDate(iso) {
  if (!iso) return '-';
  const d = new Date(iso);
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}.${mm}.${dd}`;
}

export default function BookDetailPage({ bookId, onBack = () => {}, onEdit = () => {}, onDelete = () => {} }) {
  const [book, setBook] = useState(null);
  const [genres, setGenres] = useState([]);
  // status: 'loading'(불러오는 중) | 'done'(성공) | 'notFound'(없는 책) | 'error'(서버 오류)
  const [status, setStatus] = useState('loading');
  const [retry, setRetry] = useState(0);

  useEffect(() => {
    async function load() {
      setStatus('loading');
      try {
        const [bookRes, genreRes] = await Promise.all([
          fetch(`${API_URL}/books/${bookId}`),
          fetch(`${API_URL}/genre`),
        ]);
        if (bookRes.status === 404) {
          setStatus('notFound');
          return;
        }
        if (!bookRes.ok) throw new Error('서버 응답 오류');
        setBook(await bookRes.json());
        setGenres(genreRes.ok ? await genreRes.json() : []);
        setStatus('done');
      } catch (err) {
        console.error(err);
        setStatus('error');
      }
    }
    load();
  }, [bookId, retry]);

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
          <button type="button" className="detail-btn" onClick={() => onEdit(book)}>수정</button>
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
