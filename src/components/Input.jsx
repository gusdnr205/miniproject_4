// 한 줄 입력창 부품 (아이디, 비밀번호, 제목, 저자, 검색어, API Key)
// error: 값이 있으면 빨간 테두리로 표시
function Input({ value, onChange, placeholder, type = 'text', error = false, disabled = false }) {
  return (
    <input
      type={type}
      className={`input ${error ? 'input-error' : ''}`}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      disabled={disabled}
    />
  );
}

export default Input;
