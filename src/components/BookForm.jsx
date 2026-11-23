import { useState } from 'react';
import '../styles/BookForm.css';

const CONTENT_MAX = 1000; // 책 소개 최대 글자 수

// 도서 등록·수정 공용 폼
// genres: 장르 목록 (GET /genre 결과)
// initialBook: 수정할 때 기존 도서 (등록이면 생략)
// defaultAuthor: 등록할 때 저자 칸 기본값 (예: 로그인한 사용자 이름)
// onSubmit: 저장 버튼 클릭 시 호출, { TITLE, AUTHOR_NM, GENRE, CONTENT }를 넘겨줌 (db.json 필드명 그대로)
// onCancel: 취소 버튼 클릭 시 호출
// submitting: 저장 중이면 true (버튼 비활성화)
// cover: 표지 칸에 보여줄 내용 (수정 화면에서 표지·AI 버튼을 넣을 때 사용, 없으면 안내 문구)
// onDelete: 넘기면 왼쪽 아래에 삭제 버튼이 생김 (수정 화면용)
function BookForm({
  genres = [],
  initialBook = null,
  defaultAuthor = '',
  onSubmit = () => {},
  onCancel = () => {},
  submitting = false,
  cover = null,
  onDelete = null,
}) {
  const isEdit = Boolean(initialBook);
  const [title, setTitle] = useState(initialBook?.TITLE ?? '');
  const [authorNm, setAuthorNm] = useState(initialBook?.AUTHOR_NM ?? defaultAuthor);
  const [genre, setGenre] = useState(initialBook?.GENRE ?? '');
  const [content, setContent] = useState(initialBook?.CONTENT ?? '');
  const [errors, setErrors] = useState({});

  // 유효성 검사: 제목·장르·책 소개는 필수 (공백만 입력도 안 됨)
  const validate = () => {
    const next = {};
    if (!title.trim()) next.title = '제목을 입력해 주세요.';
    if (!genre) next.genre = '장르를 선택해 주세요.';
    if (!content.trim()) next.content = '책 소개를 입력해 주세요.';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit({
      TITLE: title.trim(),
      AUTHOR_NM: authorNm.trim(),
      GENRE: Number(genre),
      CONTENT: content.trim(),
    });
  };

  return (
    <form className="book-form" onSubmit={handleSubmit} noValidate>
      <div className="book-form-card">
        <section className="book-form-fields">
          <h2 className="book-form-section">기본 정보</h2>

          <div className="book-form-label-row">
            <label className="book-form-label" htmlFor="book-title">
              제목 <span className="book-form-required">*</span>
            </label>
            {errors.title && <span className="book-form-error">{errors.title}</span>}
          </div>
          <input
            id="book-title"
            className="book-form-input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="도서 제목을 입력하세요"
            aria-invalid={Boolean(errors.title)}
          />

          <div className="book-form-row">
            <div>
              <label className="book-form-label" htmlFor="book-author">저자</label>
              <input
                id="book-author"
                className="book-form-input"
                value={authorNm}
                onChange={(e) => setAuthorNm(e.target.value)}
                placeholder="저자명을 입력하세요"
              />
            </div>
            <div>
              <div className="book-form-label-row">
                <label className="book-form-label" htmlFor="book-genre">
                  장르 <span className="book-form-required">*</span>
                </label>
                {errors.genre && <span className="book-form-error">{errors.genre}</span>}
              </div>
              <select
                id="book-genre"
                className="book-form-input"
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
                aria-invalid={Boolean(errors.genre)}
              >
                <option value="">장르를 선택하세요</option>
                {genres.map((g) => (
                  <option key={g.ID} value={g.ID}>{g.GENRE_NM}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="book-form-label-row">
            <label className="book-form-label" htmlFor="book-content">
              책 소개 <span className="book-form-required">*</span>
            </label>
            {errors.content && <span className="book-form-error">{errors.content}</span>}
          </div>
          <textarea
            id="book-content"
            className="book-form-input book-form-textarea"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="도서 내용을 입력하세요"
            rows={6}
            maxLength={CONTENT_MAX}
            aria-invalid={Boolean(errors.content)}
          />
          <p className="book-form-count">{content.length} / {CONTENT_MAX}자</p>
        </section>

        <section className="book-form-cover">
          <h2 className="book-form-section">표지 이미지</h2>
          {cover ?? (
            <div className="book-form-cover-box book-form-cover-empty">
              <strong>등록된 표지가 없어요</strong>
              <span>등록 후 AI 표지를 만들 수 있어요.</span>
            </div>
          )}
        </section>
      </div>

      <div className="book-form-actions">
        {onDelete && (
          <button
            type="button"
            className="book-form-button book-form-delete"
            onClick={onDelete}
            disabled={submitting}
          >
            삭제
          </button>
        )}
        <button type="button" className="book-form-button book-form-cancel" onClick={onCancel}>
          취소
        </button>
        <button type="submit" className="book-form-button book-form-submit" disabled={submitting}>
          {submitting ? '저장 중…' : isEdit ? '저장' : '등록'}
        </button>
      </div>
    </form>
  );
}

export default BookForm;
