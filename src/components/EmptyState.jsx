// 비어 있을 때 보여주는 안내 (책이 없을 때, 검색 결과가 없을 때)
// title, description : 안내 문구
// actionLabel, onAction : 버튼 글자와 눌렀을 때 실행할 함수 (없으면 버튼 숨김)
import Button from './Button';

function EmptyState({ title, description, actionLabel, onAction }) {
  return (
    <div className="empty-state">
      <div className="empty-state-icon" aria-hidden="true">📖</div>
      <strong>{title}</strong>
      {description && <p>{description}</p>}
      {actionLabel && (
        <Button variant="primary" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}

export default EmptyState;
