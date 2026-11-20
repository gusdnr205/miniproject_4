// 여러 줄 입력창 부품 (책 소개)
function TextArea({ value, onChange, placeholder, rows = 5, error = false }) {
  return (
    <textarea
      className={`input textarea ${error ? 'input-error' : ''}`}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
    />
  );
}

export default TextArea;
