// 표지 부품 (목록 카드, 상세, 등록·수정, AI 팝업에서 같이 사용)
// url: db.json의 COVER_IMAGE_URL. 비어 있으면 "표지 없음" 박스를 보여줌
// title, author: 그림 위에 겹쳐서 보여줄 제목·저자 (AI 그림에는 글자를 넣지 않기로 할 경우 사용)
// size: 'sm'(목록 카드) | 'md'(상세·폼) | 'lg'
function CoverImage({ url, title, author, size = 'md' }) {
  if (!url) {
    return (
      <div className={`cover cover-${size} cover-empty`}>
        <span className="cover-empty-text">표지 없음</span>
      </div>
    );
  }

  return (
    <div className={`cover cover-${size}`}>
      <img src={url} alt={`${title ?? '도서'} 표지`} />
      {title && (
        <div className="cover-overlay">
          <strong>{title}</strong>
          {author && <span>{author}</span>}
        </div>
      )}
    </div>
  );
}

export default CoverImage;
