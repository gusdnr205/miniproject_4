// 내 도서 목록 화면 (담당: 최연진)
// 맡은 기능: 도서 목록 조회 / 빈 목록 / 조건 조회(검색·장르) / 상세 페이지 이동
//
// 주소: /books  (App.jsx 라우터에 연결)
// - 관리자는 전체 도서, 일반 사용자는 로그인 ID로 "내 책"을 불러옴
// - 카드 클릭 → /books/{책ID} (상세),  [새 도서 등록] → /books/new
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useFetch } from '../api/useFetch';
import DeleteBookDialog from '../components/DeleteBookDialog';
import { canDeleteBook, getLoginUserId, isAdmin } from '../utils/bookPermissions';
import './BookListPage.css';

// 서버 주소는 각 파일에 적지 않고 .env의 VITE_API_URL 한 곳에서 관리 (useFetch가 붙여줌)

// "2026-11-20T00:00:00.000Z" → "2026.11.20"
function formatDate(iso) {
  if (!iso) return '-';
  const d = new Date(iso);
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}.${mm}.${dd}`;
}

// 등록일 선택칸 목록 (days: 오늘부터 며칠 전까지 볼지, ''면 전체)
const DATE_OPTIONS = [
  { value: '', label: '등록일: 전체 기간' },
  { value: '0', label: '오늘' },
  { value: '7', label: '최근 7일' },
  { value: '30', label: '최근 30일' },
  { value: '90', label: '최근 3개월' },
];

// "최근 7일" → 7일 전 0시 0분을 "2026-11-16T..." 형태로 바꿈
function getStartDate(days) {
  const d = new Date();
  d.setHours(0, 0, 0, 0); // 그날 0시부터
  d.setDate(d.getDate() - Number(days));
  return d.toISOString();
}

// API 명세서 기준 경로 (서버 주소 뒤에 붙는 부분)
//   내 도서 목록 : /books?AUTHOR_ID={로그인ID}&_sort=CREATED_AT&_order=desc (최신 등록순)
//   검색        : 받아온 뒤 화면에서 제목·저자로 거름 (q는 표지 base64까지 검색해서 사용 안 함)
//   장르 필터    : ...&GENRE={장르ID}  ("장르 전체"면 생략)
//   등록일  : ...&CREATED_AT_gte={시작 날짜}  (그 날짜 이후에 만든 책만, "전체"면 생략)
function buildBooksUrl(authorId, keyword, genre, days) {
  const params = new URLSearchParams({ _sort: 'CREATED_AT', _order: 'desc' });
  // 관리자만 작성자 필터를 생략해 다른 사용자의 도서도 관리할 수 있다.
  if (!isAdmin(authorId)) params.append('AUTHOR_ID', authorId);
  // if (keyword) params.append('q', keyword);  // q(전체 필드 검색)는 표지 base64까지 검색돼서 사용 안 함 → 아래 load()에서 제목·저자로 거름
  if (genre) params.append('GENRE', genre);
  if (days !== '') params.append('CREATED_AT_gte', getStartDate(days));
  return `/books?${params.toString()}`;
}

export default function BookListPage() {
  const navigate = useNavigate();
  const { request } = useFetch(); // 팀 공용 요청 도구
  const authorId = getLoginUserId();
  const openDetail = (id) => navigate(`/books/${id}`);
  const goCreate = () => navigate('/books/new');

  const [books, setBooks] = useState([]);
  const [genres, setGenres] = useState([]);
  const [selectedIds, setSelectedIds] = useState(() => new Set());
  const [deleting, setDeleting] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  // 입력 중인 값 (검색 버튼을 누르기 전)
  const [keywordInput, setKeywordInput] = useState('');
  const [genreInput, setGenreInput] = useState('');
  const [dateInput, setDateInput] = useState('');
  // 실제로 검색에 쓰는 값 (검색 버튼을 누르면 바뀜)
  const [filter, setFilter] = useState({ keyword: '', genre: '', days: '' });

  // status: 'loading' | 'done' | 'error'
  const [status, setStatus] = useState('loading');
  const [retry, setRetry] = useState(0);

  // 장르 목록: 처음 한 번만
  useEffect(() => {
    request('/genre')
      .then(setGenres)
      .catch(() => setGenres([]));
  }, [request]);

  // 책 목록: 처음 + 검색할 때마다
  useEffect(() => {
    if (!authorId) return; // 로그인 안 했으면 불러오지 않음
    let ignore = false;
    async function load() {
      setStatus('loading');
      try {
        const data = await request(buildBooksUrl(authorId, filter.keyword, filter.genre, filter.days));
        if (ignore) return;
        // 제목 또는 저자에 검색어가 들어간 책만 (대소문자 무시)
        const kw = filter.keyword.toLowerCase();
        const list = kw
          ? data.filter((b) => `${b.TITLE} ${b.AUTHOR_NM}`.toLowerCase().includes(kw))
          : data;
        setBooks(list);
        setStatus('done');
      } catch (err) {
        if (ignore) return;
        console.error(err);
        setStatus('error');
      }
    }
    load();
    return () => { ignore = true; };
  }, [authorId, filter, retry, request]);

  // 검색 (버튼 또는 Enter)
  const handleSearch = (e) => {
    e.preventDefault();
    // 화면에 보이지 않는 도서가 선택 삭제에 남지 않도록 검색할 때 선택을 초기화한다.
    setSelectedIds(new Set());
    setDeleteError('');
    setFilter({ keyword: keywordInput.trim(), genre: genreInput, days: dateInput });
  };

  // 검색 조건 지우고 전체 목록으로
  const resetSearch = () => {
    setKeywordInput('');
    setGenreInput('');
    setDateInput('');
    setSelectedIds(new Set());
    setDeleteError('');
    setFilter({ keyword: '', genre: '', days: '' });
  };

  const genreNameOf = (code) => genres.find((g) => g.ID === Number(code))?.GENRE_NM ?? '';
  const isFiltering = Boolean(filter.keyword || filter.genre || filter.days);
  const deletableBooks = books.filter((book) => canDeleteBook(authorId, book));
  const selectedBooks = deletableBooks.filter((book) => selectedIds.has(book.ID));
  const allSelected = deletableBooks.length > 0 && selectedBooks.length === deletableBooks.length;

  function toggleSelection(id, checked) {
    setSelectedIds((current) => {
      const next = new Set(current);
      if (checked) next.add(id);
      else next.delete(id);
      return next;
    });
  }

  async function handleDeleteSelected() {
    setConfirmingDelete(false);
    const currentUserId = getLoginUserId();
    const targets = selectedBooks.filter((book) => canDeleteBook(currentUserId, book));
    if (deleting || targets.length === 0) return;

    setDeleting(true);
    setDeleteError('');
    try {
      // JSON Server에는 일괄 삭제 API가 없으므로 도서별로 요청한다.
      // 일부만 실패하면 성공한 항목만 제거하고 실패한 항목은 선택 상태로 남긴다.
      const results = await Promise.allSettled(targets.map((book) => (
        request(`/books/${encodeURIComponent(book.ID)}`, { method: 'DELETE' })
      )));
      const removedIds = new Set(targets.filter((_, index) => results[index].status === 'fulfilled').map((book) => book.ID));
      const failedCount = targets.length - removedIds.size;
      setBooks((current) => current.filter((book) => !removedIds.has(book.ID)));
      setSelectedIds((current) => new Set([...current].filter((id) => !removedIds.has(id))));
      if (failedCount) setDeleteError(`${failedCount}권을 삭제하지 못했어요. 선택된 도서를 다시 시도해 주세요.`);
    } finally {
      setDeleting(false);
    }
  }

  // 목록 영역: 상황에 따라 다른 내용
  let content;
  if (!authorId) {
    content = (
      <div className="list-state">
        <strong>로그인이 필요해요</strong>
        <p>로그인하면 내가 등록한 도서를 볼 수 있어요.</p>
        <button type="button" className="list-btn list-btn-primary" onClick={() => navigate('/login')}>로그인하러 가기</button>
      </div>
    );
  } else if (status === 'loading') {
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
        <p>{isFiltering ? '다른 검색어나 장르, 날짜로 다시 찾아보세요.' : '등록한 도서는 여기에 카드로 모여요.'}</p>
        {isFiltering ? (
          <button type="button" className="list-btn list-btn-primary" onClick={resetSearch}>전체 목록 보기</button>
        ) : (
          <button type="button" className="list-btn list-btn-primary" onClick={goCreate}>+ 새 도서 등록</button>
        )}
      </div>
    );
  } else {
    content = (
      <>
        <p className="list-count">{isFiltering ? '검색 결과' : '전체'} {books.length}권 · 최신 등록순</p>
        {deletableBooks.length > 0 && (
          <div className="list-selection">
            <label>
              <input
                type="checkbox"
                checked={allSelected}
                disabled={deleting}
                onChange={(event) => setSelectedIds(new Set(event.target.checked ? deletableBooks.map((book) => book.ID) : []))}
              />
              전체 선택
            </label>
            <button
              type="button"
              className="list-btn list-btn-danger"
              disabled={deleting || selectedBooks.length === 0}
              onClick={() => setConfirmingDelete(true)}
            >
              {deleting ? '삭제 중…' : `선택 삭제 (${selectedBooks.length})`}
            </button>
          </div>
        )}
        <div className="list-grid">
          {books.map((book) => (
            <article key={book.ID} className="list-card" onClick={() => openDetail(book.ID)}>
              {canDeleteBook(authorId, book) && (
                <label className="list-card-select" onClick={(event) => event.stopPropagation()}>
                  <input
                    type="checkbox"
                    aria-label={`${book.TITLE} 선택`}
                    checked={selectedIds.has(book.ID)}
                    disabled={deleting}
                    onChange={(event) => toggleSelection(book.ID, event.target.checked)}
                  />
                </label>
              )}
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
          <h1 className="list-title">{isAdmin(authorId) ? '전체 도서 목록' : '내 도서 목록'}</h1>
          <p className="list-subtitle">등록한 도서를 찾고 표지를 관리하세요.</p>
        </div>
        <button type="button" className="list-btn list-btn-primary" onClick={goCreate}>+ 새 도서 등록</button>
      </div>

      {/* 검색 줄: form으로 감싸서 Enter로도 검색 */}
      <form className="list-search" onSubmit={handleSearch}>
        <input
          className="list-input list-search-keyword"
          disabled={deleting}
          value={keywordInput}
          onChange={(e) => setKeywordInput(e.target.value)}
          placeholder="제목 또는 저자 검색"
        />
        <select className="list-input list-search-genre" value={genreInput} disabled={deleting} onChange={(e) => setGenreInput(e.target.value)}>
          <option value="">장르 전체</option>
          {genres.map((g) => (
            <option key={g.ID} value={g.ID}>{g.GENRE_NM}</option>
          ))}
        </select>
        <select className="list-input list-search-date" value={dateInput} disabled={deleting} onChange={(e) => setDateInput(e.target.value)}>
          {DATE_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
        <button type="submit" className="list-btn list-btn-primary" disabled={deleting}>검색</button>
      </form>

      {deleteError && <p className="list-delete-error" role="alert">{deleteError}</p>}
      {confirmingDelete && (
        <DeleteBookDialog count={selectedBooks.length} onCancel={() => setConfirmingDelete(false)} onConfirm={handleDeleteSelected} />
      )}
      {content}
    </div>
  );
}
