// 내 도서 목록 화면 (담당: 최연진)
// 맡은 기능: 도서 목록 조회 / 빈 목록 / 조건 조회(검색·장르) / 상세 페이지 이동
// ※ 카드 모양(도서 목록 표기)은 메인 담당과 맞춰서 바꿀 수 있게 아래 BookItem 하나로 모아둠
//
// 받는 값(props)
//   authorId : 로그인한 사용자 아이디 (db.json books의 AUTHOR_ID와 같은 값) — 이 사람 책만 불러옴
//   onOpen   : 카드를 눌렀을 때 실행할 함수 → onOpen(책ID)  (상세 화면으로 이동)
//   onCreate : [새 도서 등록]을 눌렀을 때 실행할 함수
import { useEffect, useState } from 'react';
import Button from '../components/Button';
import Tag from '../components/Tag';
import CoverImage from '../components/CoverImage';
import SearchBar from '../components/SearchBar';
import EmptyState from '../components/EmptyState';
import '../styles/list.css';

const API_URL = 'http://127.0.0.1:3000';

// "2026-11-20T00:00:00.000Z" → "2026.11.20"
function formatDate(iso) {
  if (!iso) return '-';
  const d = new Date(iso);
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}.${mm}.${dd}`;
}

// API 명세서 기준 주소 만들기
//   내 도서 목록 : /books?AUTHOR_ID={로그인ID}&_sort=CREATED_AT&_order=desc  (최신 등록순)
//   검색        : ...&q={검색어}
//   장르 필터    : ...&GENRE={장르ID}   ("장르 전체"면 생략)
function buildBooksUrl(authorId, { keyword, genre }) {
  const params = new URLSearchParams({ AUTHOR_ID: authorId, _sort: 'CREATED_AT', _order: 'desc' });
  if (keyword) params.append('q', keyword);
  if (genre) params.append('GENRE', genre);
  return `${API_URL}/books?${params.toString()}`;
}

// 책 카드 하나
function BookItem({ book, genreName, onOpen }) {
  return (
    <article className="list-card" onClick={() => onOpen(book.ID)}>
      <div className="list-card-cover">
        <CoverImage url={book.COVER_IMAGE_URL} title={book.TITLE} author={book.AUTHOR_NM} size="sm" />
      </div>
      <div className="list-card-body">
        <h3 className="list-card-title">{book.TITLE}</h3>
        <p className="list-card-meta">
          {book.AUTHOR_NM}
          {genreName && <> · {genreName}</>}
        </p>
        <div className="list-card-footer">
          <span>등록일 {formatDate(book.CREATED_AT)}</span>
          <span className="list-card-arrow" aria-hidden="true">↗</span>
        </div>
      </div>
    </article>
  );
}

function BookListPage({ authorId, onOpen = () => {}, onCreate = () => {} }) {
  const [books, setBooks] = useState([]);
  const [genres, setGenres] = useState([]);
  const [filter, setFilter] = useState({ keyword: '', genre: '' });
  // status: 'loading' | 'done' | 'error'
  const [status, setStatus] = useState('loading');
  const [retry, setRetry] = useState(0);
  // searchKey가 바뀌면 검색 줄이 처음 상태(빈 칸)로 돌아감
  const [searchKey, setSearchKey] = useState(0);

  // 검색 조건을 지우고 전체 목록으로
  const resetSearch = () => {
    setFilter({ keyword: '', genre: '' });
    setSearchKey((n) => n + 1);
  };

  // 장르 목록은 처음 한 번만 불러옴
  useEffect(() => {
    fetch(`${API_URL}/genre`)
      .then((res) => (res.ok ? res.json() : []))
      .then(setGenres)
      .catch(() => setGenres([]));
  }, []);

  // 책 목록: 처음 + 검색 조건이 바뀔 때마다 다시 불러옴
  useEffect(() => {
    async function load() {
      setStatus('loading');
      try {
        const res = await fetch(buildBooksUrl(authorId, filter));
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

  const genreNameOf = (code) => genres.find((g) => g.GENRE_CODE === Number(code))?.GENRE_NM ?? '';
  const isFiltering = Boolean(filter.keyword || filter.genre);

  // 목록 영역에 보여줄 내용 (상황별로 다름)
  let content;
  if (status === 'loading') {
    content = <div className="list-state">도서 목록을 불러오는 중이에요…</div>;
  } else if (status === 'error') {
    content = (
      <div className="list-state">
        <strong>도서 목록을 불러오지 못했어요</strong>
        <p>json-server가 켜져 있는지 확인하고 다시 시도해주세요.</p>
        <Button onClick={() => setRetry((n) => n + 1)}>다시 시도</Button>
      </div>
    );
  } else if (books.length === 0 && isFiltering) {
    content = (
      <EmptyState
        title="검색 결과가 없어요"
        description="다른 검색어나 장르로 다시 찾아보세요."
        actionLabel="전체 목록 보기"
        onAction={resetSearch}
      />
    );
  } else if (books.length === 0) {
    content = (
      <EmptyState
        title="첫 번째 도서를 등록해보세요"
        description="등록한 도서는 여기에 카드로 모여요."
        actionLabel="+ 새 도서 등록"
        onAction={onCreate}
      />
    );
  } else {
    content = (
      <>
        <p className="list-count">
          {isFiltering ? '검색 결과' : '전체'} {books.length}권 · 최신 등록순
        </p>
        <div className="list-grid">
          {books.map((book) => (
            <BookItem key={book.ID} book={book} genreName={genreNameOf(book.GENRE)} onOpen={onOpen} />
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
        <Button variant="primary" onClick={onCreate}>+ 새 도서 등록</Button>
      </div>

      <SearchBar key={searchKey} genres={genres} onSearch={setFilter} />

      {content}
    </div>
  );
}

export default BookListPage;
