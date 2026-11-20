// 목록 화면 미리보기 전용 시작 파일 (팀 App.jsx와 상관없음)
// 목록 → 카드 클릭 → 상세 → ‹ 도서 목록 으로 돌아오는 흐름까지 확인할 수 있음
// 실행: 터미널 1 → npm run dev:api / 터미널 2 → npm run dev
//       브라우저 → http://localhost:5173/list-preview.html
import { StrictMode, useState } from 'react';
import { createRoot } from 'react-dom/client';
import BookListPage from './pages/BookListPage';
import BookDetailPage from './pages/BookDetailPage';

// 로그인 기능이 아직 없어서, 미리보기에서는 사용자를 골라서 확인
const USERS = [
  { id: 'demo-seoyun', label: '한서윤 (책 2권)' },
  { id: 'demo-dohyeon', label: '이도현 (책 1권)' },
  { id: 'nobody', label: '책 없는 사용자' },
];

function ListPreview() {
  const [authorId, setAuthorId] = useState('demo-seoyun');
  const [openedId, setOpenedId] = useState(null); // null이면 목록, 숫자면 그 책 상세

  return (
    <div style={{ background: '#f4f6f4', minHeight: '100vh', textAlign: 'left' }}>
      <div style={{ padding: '12px 24px', background: '#fff', borderBottom: '1px solid #dfe3e0', fontSize: 14 }}>
        미리보기용 로그인 사용자:{' '}
        {USERS.map((u) => (
          <button
            key={u.id}
            onClick={() => { setAuthorId(u.id); setOpenedId(null); }}
            style={{ marginRight: 6, fontWeight: authorId === u.id ? 700 : 400 }}
          >
            {u.label}
          </button>
        ))}
      </div>

      {openedId === null ? (
        <BookListPage
          key={authorId}
          authorId={authorId}
          onOpen={(id) => setOpenedId(id)}
          onCreate={() => alert('도서 등록 화면으로 이동')}
        />
      ) : (
        <BookDetailPage
          bookId={openedId}
          onBack={() => setOpenedId(null)}
          onEdit={(book) => alert(`"${book.TITLE}" 수정 화면으로 이동`)}
          onDelete={(book) => alert(`"${book.TITLE}" 삭제 확인창 열기`)}
        />
      )}
    </div>
  );
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ListPreview />
  </StrictMode>
);
