// 체크박스 부품 (카드 선택, 전체 선택)
// e.stopPropagation(): 카드 안에서 체크박스를 눌러도 상세 화면으로 넘어가지 않게 막음
function Checkbox({ checked, onChange, label }) {
  return (
    <label className="checkbox" onClick={(e) => e.stopPropagation()}>
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      {label && <span>{label}</span>}
    </label>
  );
}

export default Checkbox;
