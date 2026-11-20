import './BookCard.css';

// 2026-11-20T00:00:00.000Z → "2026.11.20"
function formatDate(iso) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '-';
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}.${m}.${day}`;
}

// 도서 1권을 보여주는 카드
// book: db.json의 books 항목 1개
// genreName: 장르 이름 (BookList가 계산해서 전달)
// onClick: 카드 클릭 시 호출, 도서 ID를 넘겨줌
function BookCard({ book, genreName = '', onClick = () => {} }) {
  return (
    <li className="book-card" onClick={() => onClick(book.ID)}>
      {book.COVER_IMAGE_URL ? (
        <img
          className="book-card-cover"
          src={book.COVER_IMAGE_URL}
          alt={`${book.TITLE} 표지`}
        />
      ) : (
        <div className="book-card-cover book-card-cover-empty">
          <span>{book.TITLE}</span>
        </div>
      )}

      <h3 className="book-card-title">{book.TITLE}</h3>
      <p className="book-card-meta">
        {book.AUTHOR_NM}
        {genreName && ` · ${genreName}`}
      </p>
      <p className="book-card-date">등록일 {formatDate(book.CREATED_AT)}</p>
    </li>
  );
}

export default BookCard;
