import './Header.css';

// 상단 네비게이션
// currentPage: 현재 화면 ('list' | 'create') → 메뉴 강조용
// onNavigate: 메뉴 클릭 시 호출 (App에서 화면 전환 함수를 넘겨줌)
function Header({ currentPage = 'list', onNavigate = () => {} }) {
  return (
    <header className="header">
      <div className="header-inner">
        <button
          type="button"
          className="header-logo"
          onClick={() => onNavigate('list')}
        >
          <span className="header-logo-icon">📖</span>
          북커버 AI
        </button>

        <nav className="header-nav">
          <button
            type="button"
            className={currentPage === 'list' ? 'header-link active' : 'header-link'}
            onClick={() => onNavigate('list')}
          >
            도서 목록
          </button>
          <button
            type="button"
            className={currentPage === 'create' ? 'header-link active' : 'header-link'}
            onClick={() => onNavigate('create')}
          >
            도서 등록
          </button>
        </nav>
      </div>
    </header>
  );
}

export default Header;
