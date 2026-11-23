export function getLoginUserId() {
  try {
    return JSON.parse(localStorage.getItem('loginUser'))?.id ?? null;
  } catch {
    return null;
  }
}

export function isAdmin(userId) {
  return userId === 'admin';
}

export function canDeleteBook(userId, book) {
  // 샘플 DB에는 역할 필드가 없어서 admin 계정 ID를 기준으로 구분한다.
  // localStorage 기반 검사는 화면과 버튼을 제어하는 용도다.
  return Boolean(userId && book?.ID != null && (isAdmin(userId) || book.AUTHOR_ID === userId));
}
