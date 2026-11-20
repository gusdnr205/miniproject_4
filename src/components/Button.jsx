// 버튼 부품
// variant: 'default'(흰 버튼) | 'primary'(초록 버튼) | 'danger'(빨간 테두리 버튼)
function Button({ children, variant = 'default', onClick, disabled = false, type = 'button' }) {
  return (
    <button
      type={type}
      className={`btn btn-${variant}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}

export default Button;
