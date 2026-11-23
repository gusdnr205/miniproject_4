import { useState } from 'react';
import BookCard from './BookCard';
import './BookList.css';

// 도서 목록 화면 (제목 영역 + 검색/장르 필터 + 카드 목록)
// books: 도서 배열, genres: 장르 배열 (App에서 fetch한 결과를 전달)
// onSelectBook(id): 카드 클릭 시, onCreate(): '새 도서 등록' 클릭 시
function BookList({
  books = [],
  genres = [],
  onSelectBook = () => {},
  onCreate = () => {},
}) {
  const [inputKeyword, setInputKeyword] = useState(''); // 입력창에 쓰는 중인 글자
  const [keyword, setKeyword] = useState(''); // 검색 버튼으로 확정된 검색어
  const [genreCode, setGenreCode] = useState(''); // '' = 장르 전체

  const handleSubmit = (e) => {
    e.preventDefault();
    setKeyword(inputKeyword.trim());
  };

  const getGenreName = (code) => {
    const genre = genres.find((g) => g.GENRE_CODE === code);
    return genre ? genre.GENRE_NM : '';
  };

  // filter는 새 배열을 만들어서 원본(books)은 바뀌지 않음 → 이어서 최신 등록순 정렬
  const visibleBooks = books
    .filter((book) => {
      const text = `${book.TITLE} ${book.AUTHOR_NM}`.toLowerCase();
      const matchKeyword = text.includes(keyword.toLowerCase());
      const matchGenre = genreCode === '' || book.GENRE === Number(genreCode);
      return matchKeyword && matchGenre;
    })
    .sort((a, b) => new Date(b.CREATED_AT) - new Date(a.CREATED_AT));

  return (
    <section className="book-list-page">
      <div className="book-list-head">
        <div>
          <h2>내 도서 목록</h2>
          <p>등록한 도서를 찾고 표지를 관리하세요.</p>
        </div>
        <button type="button" className="book-list-create" onClick={onCreate}>
          + 새 도서 등록
        </button>
      </div>

      <form className="book-list-filter" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="제목 또는 저자 검색"
          value={inputKeyword}
          onChange={(e) => setInputKeyword(e.target.value)}
        />
        <select value={genreCode} onChange={(e) => setGenreCode(e.target.value)}>
          <option value="">장르 전체</option>
          {genres.map((g) => (
            <option key={g.GENRE_CODE} value={g.GENRE_CODE}>
              {g.GENRE_NM}
            </option>
          ))}
        </select>
        <button type="submit">검색</button>
      </form>

      {books.length === 0 ? (
        <div className="book-list-empty">
          <p>등록된 도서가 없습니다.</p>
          <button type="button" className="book-list-create" onClick={onCreate}>
            + 새 도서 등록
          </button>
        </div>
      ) : visibleBooks.length === 0 ? (
        <div className="book-list-empty">
          <p>검색 결과가 없습니다.</p>
        </div>
      ) : (
        <>
          <p className="book-list-count">총 {visibleBooks.length}권</p>
          <ul className="book-grid">
            {visibleBooks.map((book) => (
              <BookCard
                key={book.ID}
                book={book}
                genreName={getGenreName(book.GENRE)}
                onClick={onSelectBook}
              />
            ))}
          </ul>
        </>
      )}
    </section>
  );
}

export default BookList;
