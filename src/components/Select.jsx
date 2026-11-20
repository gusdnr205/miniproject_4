// 선택 상자 부품 (장르 선택, 정렬)
// options: [{ value: 1, label: '소설' }, ...] 형태
function Select({ value, onChange, options, placeholder }) {
  return (
    <select className="input select" value={value} onChange={(e) => onChange(e.target.value)}>
      {placeholder && <option value="">{placeholder}</option>}
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}

export default Select;
