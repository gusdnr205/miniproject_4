import { useEffect, useId, useRef } from 'react';
import '../styles/BookDelete.css';

export default function DeleteBookDialog({ count, title, onCancel, onConfirm }) {
  const dialog = useRef(null);
  const headingId = useId();

  useEffect(() => {
    const element = dialog.current;
    element.showModal();
    return () => element.close();
  }, []);

  return (
    <dialog ref={dialog} className="delete-book-dialog" aria-labelledby={headingId} onCancel={onCancel}>
      <h2 id={headingId}>{title ? '이 도서를 삭제할까요?' : `선택한 도서 ${count}권을 삭제할까요?`}</h2>
      <p>{title ? `‘${title}’을(를) 삭제하면 복구할 수 없어요.` : '삭제한 도서는 복구할 수 없어요.'}</p>
      <div className="delete-book-actions">
        <button type="button" onClick={onCancel} autoFocus>취소</button>
        <button type="button" className="delete-book-confirm" onClick={onConfirm}>삭제 확인</button>
      </div>
    </dialog>
  );
}
