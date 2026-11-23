// 위치: src/components/Header.jsx
// 역할: 모든 페이지 상단에 들어가는 네비게이션 (로고, 메뉴, 로그인 유저 정보, 로그아웃)
// 사용법: 어느 페이지에서나 <Header /> 만 쓰면 됨 (props 필요 없음)

import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router';
import './Header.css';

// 로그인할 때 LoginPage가 localStorage에 저장해 둔 정보를 꺼냄
// 저장된 게 없거나 형식이 깨져 있으면 null (= 로그인 안 한 상태)
function getLoginUser() {
  try {
    const saved = localStorage.getItem('loginUser'); // 예: '{"id":"admin","userNm":"관리자"}'
    return saved ? JSON.parse(saved) : null; // 글자를 객체로 바꿈
  } catch {
    return null;
  }
}

export default function Header() {
  const navigate = useNavigate(); // 주소를 바꿔 화면을 이동시키는 함수
  const { pathname } = useLocation(); // 지금 주소 (예: '/books', '/books/new')
  const [loginUser] = useState(getLoginUser); // 화면이 처음 뜰 때 한 번만 로그인 정보를 읽음

  const handleLogout = () => {
    localStorage.removeItem('loginUser'); // 저장된 로그인 정보 삭제
    navigate('/login', { replace: true }); // 로그인 화면으로 이동 (뒤로가기로 못 돌아오게 교체)
  };

  return (
    <header className="header">
      <div className="header-inner">
        <button type="button" className="header-logo" onClick={() => navigate('/books')}>
          <span className="header-logo-icon">📖</span>
          북커버 AI
        </button>

        <nav className="header-nav">
          <button
            type="button"
            className={pathname === '/books' ? 'header-link active' : 'header-link'}
            onClick={() => navigate('/books')}
          >
            도서 목록
          </button>
          <button
            type="button"
            className={pathname === '/books/new' ? 'header-link active' : 'header-link'}
            onClick={() => navigate('/books/new')}
          >
            도서 등록
          </button>

          <span className="header-divider" />

          {loginUser ? (
            <div className="header-user">
              <span className="header-user-name">{loginUser.userNm}</span>
              <button type="button" className="header-logout" onClick={handleLogout}>
                로그아웃
              </button>
            </div>
          ) : (
            <button type="button" className="header-logout" onClick={() => navigate('/login')}>
              로그인
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}