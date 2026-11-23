import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import BookForm from '../components/BookForm';
import { useFetch } from '../api/useFetch';

// 로그인할 때 LoginPage가 저장한 사용자 정보 { id, userNm }
function getLoginUser() {
  try {
    return JSON.parse(localStorage.getItem('loginUser')) ?? {};
  } catch {
    return {};
  }
}

// 도서 등록 페이지 (/books/new)
export default function BookNewPage() {
  const navigate = useNavigate();
  const loginUser = getLoginUser();
  const [genres, setGenres] = useState([]);
  const { request: fetchGenres, error: genreError } = useFetch();
  const { request: saveBook, loading: saving, error: saveError } = useFetch();

  // 장르 목록: GET /genre
  useEffect(() => {
    fetchGenres('/genre')
      .then(setGenres)
      .catch(() => {});
  }, [fetchGenres]);

  // 로그인 안 했으면 팝업 → 로그인 화면으로 (책이 작성자 없이 저장되는 걸 막음)
  const alerted = useRef(false); // 개발 모드에서 팝업이 두 번 뜨는 걸 막음
  useEffect(() => {
    if (loginUser.id || alerted.current) return;
    alerted.current = true;
    window.alert('로그인 후 도서를 등록할 수 있어요.');
    navigate('/login', { replace: true });
  }, [loginUser.id, navigate]);

  // 도서 등록: POST /books → 성공하면 새 도서 상세 화면으로 이동
  const handleSubmit = async (values) => {
    const now = new Date().toISOString();
    try {
      const saved = await saveBook('/books', {
        method: 'POST',
        body: {
          ...values,
          AUTHOR_NM: values.AUTHOR_NM || loginUser.userNm || '',
          AUTHOR_ID: loginUser.id,
          COVER_IMAGE_URL: '',
          CREATED_AT: now,
          UPDATED_AT: now,
        },
      });
      navigate(`/books/${saved.ID}`);
    } catch {
      // 오류 문구는 saveError로 아래에 표시됨
    }
  };

  // 로그인 화면으로 넘어가는 동안 폼을 그리지 않음
  if (!loginUser.id) return null;

  return (
    <main className="book-form-page">
      <h1 className="book-form-title">도서 등록</h1>
      {genreError && <p className="book-form-error" role="alert">장르 목록을 불러오지 못했어요.</p>}
      {saveError && <p className="book-form-error" role="alert">도서를 등록하지 못했어요. 잠시 후 다시 시도해 주세요.</p>}
      <BookForm
        genres={genres}
        defaultAuthor={loginUser.userNm ?? ''}
        onSubmit={handleSubmit}
        onCancel={() => navigate('/books')}
        submitting={saving}
      />
    </main>
  );
}
