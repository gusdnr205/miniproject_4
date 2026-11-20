// 내 도서 목록 화면 (담당: 최연진)
// 맡은 기능: 도서 목록 조회 / 빈 목록 / 조건 조회(검색·장르) / 상세 페이지 이동
//
// 받는 값(props)
//   authorId : 로그인한 사용자 아이디 (db.json books의 AUTHOR_ID) — 이 사람 책만 불러옴
//   onOpen   : 카드를 눌렀을 때 → onOpen(책ID)  (상세 화면으로 이동)
//   onCreate : [새 도서 등록]을 눌렀을 때 → onCreate()
import { useEffect, useState } from 'react';
import './BookListPage.css';

const API_URL = 'http://127.0.0.1:3000';

// "2026-11-20T00:00:00.000Z" → "2026.11.20"
function formatDate(iso) {
  if (!iso) return '-';
  const d = new Date(iso);
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}.${mm}.${dd}`;
}

// API 명세서 기준 주소
//   내 도서 목록 : /books?AUTHOR_ID={로그인ID}&_sort=CREATED_AT&_order=desc (최신 등록순)
//   검색        : ...&q={검색어}
//   장르 필터    : ...&GENRE={장르ID}  ("장르 전체"면 생략)
function buildBooksUrl(authorId, keyword, genre) {
  const params = new URLSearchParams({ AUTHOR_ID: authorId, _sort: 'CREATED_AT', _order: 'desc' });
  if (keyword) params.append('q', keyword);
  if (genre) params.append('GENRE', genre);
  return `${API_URL}/books?${params.toString()}`;
}

export default function BookListPage({ authorId, onOpen = () => {}, onCreate = () => {} }) {
  const [books, setBooks] = useState([]);
  const [genres, setGenres] = useState([]);

  // 입력 중인 값 (검색 버튼을 누르기 전)
  const [keywordInput, setKeywordInput] = useState('');
  const [genreInput, setGenreInput] = useState('');
  // 실제로 검색에 쓰는 값 (검색 버튼을 누르면 바뀜)
  const [filter, setFilter] = useState({ keyword: '', genre: '' });

  // status: 'loading' | 'done' | 'error'
  const [status, setStatus] = useState('loading');
  const [retry, setRetry] = useState(0);

  // 장르 목록: 처음 한 번만
  useEffect(() => {
    fetch(`${API_URL}/genre`)
      .then((res) => (res.ok ? res.json() : []))
      .then(setGenres)
      .catch(() => setGenres([]));
  }, []);

  // 책 목록: 처음 + 검색할 때마다
  useEffect(() => {
    async function load() {
      setStatus('loading');
      try {
        const res = await fetch(buildBooksUrl(authorId, filter.keyword, filter.genre));
        if (!res.ok) throw new Error('서버 응답 오류');
        setBooks(await res.json());
        setStatus('done');
      } catch (err) {
        console.error(err);
        setStatus('error');
      }
    }
    load();
  }, [authorId, filter, retry]);

  // 검색 (버튼 또는 Enter)
  const handleSearch = (e) => {
    e.preventDefault();
    setFilter({ keyword: keywordInput.trim(), genre: genreInput });
  };

  // 검색 조건 지우고 전체 목록으로
  const resetSearch = () => {
    setKeywordInput('');
    setGenreInput('');
    setFilter({ keyword: '', genre: '' });
  };

  const genreNameOf = (code) => genres.find((g) => g.ID === Number(code))?.GENRE_NM ?? '';
  const isFiltering = Boolean(filter.keyword || filter.genre);

  // 목록 영역: 상황에 따라 다른 내용
  let content;
  if (status === 'loading') {
    content = <div className="list-state">도서 목록을 불러오는 중이에요…</div>;
  } else if (status === 'error') {
    content = (
      <div className="list-state">
        <strong>도서 목록을 불러오지 못했어요</strong>
        <p>json-server가 켜져 있는지 확인하고 다시 시도해주세요.</p>
        <button type="button" className="list-btn" onClick={() => setRetry((n) => n + 1)}>다시 시도</button>
      </div>
    );
  } else if (books.length === 0) {
    // 검색 중이면 "검색 결과 없음", 아니면 "빈 목록"
    content = (
      <div className="list-empty">
        <div className="list-empty-icon" aria-hidden="true">📖</div>
        <strong>{isFiltering ? '검색 결과가 없어요' : '첫 번째 도서를 등록해보세요'}</strong>
        <p>{isFiltering ? '다른 검색어나 장르로 다시 찾아보세요.' : '등록한 도서는 여기에 카드로 모여요.'}</p>
        {isFiltering ? (
          <button type="button" className="list-btn list-btn-primary" onClick={resetSearch}>전체 목록 보기</button>
        ) : (
          <button type="button" className="list-btn list-btn-primary" onClick={onCreate}>+ 새 도서 등록</button>
        )}
      </div>
    );
  } else {
    content = (
      <>
        <p className="list-count">{isFiltering ? '검색 결과' : '전체'} {books.length}권 · 최신 등록순</p>
        <div className="list-grid">
          {books.map((book) => (
            <article key={book.ID} className="list-card" onClick={() => onOpen(book.ID)}>
              <div className="list-card-cover-area">
                {book.COVER_IMAGE_URL ? (
                  <img className="list-card-cover" src={book.COVER_IMAGE_URL} alt={`${book.TITLE} 표지`} />
                ) : (
                  <div className="list-card-cover list-card-cover-empty">표지 없음</div>
                )}
              </div>
              <div className="list-card-body">
                <h3 className="list-card-title">{book.TITLE}</h3>
                <p className="list-card-meta">
                  {book.AUTHOR_NM}
                  {genreNameOf(book.GENRE) && <> · {genreNameOf(book.GENRE)}</>}
                </p>
                <div className="list-card-footer">
                  <span>등록일 {formatDate(book.CREATED_AT)}</span>
                  <span className="list-card-arrow" aria-hidden="true">↗</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </>
    );
  }

  return (
    <div className="list-page">
      <div className="list-heading">
        <div>
          <h1 className="list-title">내 도서 목록</h1>
          <p className="list-subtitle">등록한 도서를 찾고 표지를 관리하세요.</p>
        </div>
        <button type="button" className="list-btn list-btn-primary" onClick={onCreate}>+ 새 도서 등록</button>
      </div>

      {/* 검색 줄: form으로 감싸서 Enter로도 검색 */}
      <form className="list-search" onSubmit={handleSearch}>
        <input
          className="list-input list-search-keyword"
          value={keywordInput}
          onChange={(e) => setKeywordInput(e.target.value)}
          placeholder="제목 또는 저자 검색"
        />
        <select className="list-input list-search-genre" value={genreInput} onChange={(e) => setGenreInput(e.target.value)}>
          <option value="">장르 전체</option>
          {genres.map((g) => (
            <option key={g.ID} value={g.ID}>{g.GENRE_NM}</option>
          ))}
        </select>
        <button type="submit" className="list-btn list-btn-primary">검색</button>
      </form>

      {content}
    </div>
  );
}
