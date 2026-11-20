// 도서 상세 화면 미리보기 전용 시작 파일 (팀 App.jsx와 상관없음)
// 실행: 터미널 1 → npm run dev:api / 터미널 2 → npm run dev
//       브라우저 → http://localhost:5173/detail-preview.html
import { StrictMode, useState } from 'react';
import { createRoot } from 'react-dom/client';
import BookDetailPage from './pages/BookDetailPage';

function DetailPreview() {
  const [bookId, setBookId] = useState(Number(new URLSearchParams(location.search).get('id')) || 1);

  return (
    <div style={{ background: '#f4f6f4', minHeight: '100vh', textAlign: 'left' }}>
      <div style={{ padding: '12px 24px', background: '#fff', borderBottom: '1px solid #dfe3e0', fontSize: 14 }}>
        미리보기용 책 선택:{' '}
        {[1, 2, 3, 99].map((id) => (
          <button key={id} onClick={() => setBookId(id)} style={{ marginRight: 6, fontWeight: bookId === id ? 700 : 400 }}>
            {id === 99 ? '없는 책(99)' : `${id}번`}
          </button>
        ))}
      </div>
      <BookDetailPage
        bookId={bookId}
        onBack={() => alert('도서 목록으로 이동')}
        onEdit={(book) => alert(`"${book.TITLE}" 수정 화면으로 이동`)}
        onDelete={(book) => alert(`"${book.TITLE}" 삭제 확인창 열기`)}
      />
    </div>
  );
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <DetailPreview />
  </StrictMode>
);
