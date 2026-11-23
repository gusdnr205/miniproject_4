import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import BookForm from '../components/BookForm';
import ImgGeneratorTab from '../components/ImgGeneratorTab';
import "../styles/ImgGenerator.css";
import { useFetch } from '../api/useFetch';

// 로그인할 때 LoginPage가 저장한 사용자 정보 { id, userNm }
function getLoginUser() {
  try {
    return JSON.parse(localStorage.getItem('loginUser')) ?? {};
  } catch {
    return {};
  }
}

// 도서 수정 페이지 (/books/:id/edit)
export default function BookEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [genres, setGenres] = useState([]);
  const [coverUrl, setCoverUrl] = useState(''); // 화면에 보이는 표지 (AI로 새로 만들면 여기만 바뀜)

  const { request: fetchBook, loading: loadingBook, error: bookError } = useFetch();
  const { request: fetchGenres } = useFetch();
  const { request: saveBook, loading: saving, error: saveError } = useFetch();

  useEffect(() => {
    let ignore = false; // 개발 모드에서 두 번 실행될 때 팝업이 두 번 뜨는 걸 막음
    fetchBook(`/books/${id}`)
      .then((data) => {
        if (ignore) return;
        // 내 책만 수정 가능: 남의 책이면 팝업 → 목록으로
        if (data.AUTHOR_ID !== getLoginUser().id) {
          window.alert('본인이 등록한 도서만 수정할 수 있어요.');
          navigate('/books', { replace: true });
          return;
        }
        setBook(data);
        setCoverUrl(data.COVER_IMAGE_URL ?? '');
      })
      .catch(() => {});
    fetchGenres('/genre')
      .then(setGenres)
      .catch(() => {});
    return () => {
      ignore = true;
    };
  }, [id, fetchBook, fetchGenres, navigate]);

  // 저장: PATCH /books/{ID} → 상세 화면으로 이동
  const handleSubmit = async (values) => {
    try {
      await saveBook(`/books/${id}`, {
        method: 'PATCH',
        body: {
          ...values,
          COVER_IMAGE_URL: coverUrl,
          UPDATED_AT: new Date().toISOString(),
        },
      });
      navigate(`/books/${id}`);
    } catch {
      // 오류 문구는 saveError로 아래에 표시됨
    }
  };

  // 삭제: DELETE /books/{ID} → 목록으로 이동
  // (확인 창은 삭제 담당이 공통 모달을 만들면 그걸로 바꾸면 됨)
  const handleDelete = async () => {
    if (!window.confirm(`'${book.TITLE}'을(를) 삭제할까요? 삭제하면 되돌릴 수 없어요.`)) return;
    try {
      await saveBook(`/books/${id}`, { method: 'DELETE' });
      navigate('/books', { replace: true });
    } catch {
      // 오류 문구는 saveError로 아래에 표시됨
    }
  };

  if (loadingBook || (!book && !bookError)) {
    return <main className="book-form-page"><p>도서 정보를 불러오는 중이에요…</p></main>;
  }
  if (bookError) {
    return (
      <main className="book-form-page">
        <p className="book-form-error" role="alert">도서 정보를 불러오지 못했어요.</p>
        <button type="button" className="book-form-button" onClick={() => navigate('/books')}>
          목록으로
        </button>
      </main>
    );
  }

  const coverChanged = coverUrl !== (book.COVER_IMAGE_URL ?? '');

  // 표지 칸: 현재 표지(없으면 안내) + AI 표지 생성/수정 버튼
  const cover = (
    <div className="book-cover-panel">
      {coverUrl ? (
        <img className="book-cover-image" src={coverUrl} alt={`${book.TITLE} 표지`} />
      ) : (
        <div className="book-form-cover-box book-form-cover-empty">
          <strong>등록된 표지가 없어요</strong>
          <span>아래 버튼으로 AI 표지를 만들 수 있어요.</span>
        </div>
      )}
      {coverChanged && <p className="book-cover-note">새 표지가 적용됐어요. 저장을 눌러야 반영돼요.</p>}
      {/* AI 표지 담당: book으로 프롬프트를 만들고, 새 표지를 고르면 onApply(Data URL)를 호출 */}
      <ImgGeneratorTab
        book={book}
        label={coverUrl ? 'AI 표지 수정' : 'AI 표지 생성'}
        onApply={setCoverUrl}
      />
    </div>
  );

  return (
    <main className="book-form-page">
      <h1 className="book-form-title">도서 수정</h1>
      {saveError && <p className="book-form-error" role="alert">처리하지 못했어요. 잠시 후 다시 시도해 주세요.</p>}
      <BookForm
        genres={genres}
        initialBook={book}
        cover={cover}
        coverDirty={coverChanged}
        onSubmit={handleSubmit}
        onCancel={() => navigate(`/books/${id}`)}
        onDelete={handleDelete}
        submitting={saving}
      />
    </main>
  );
}
