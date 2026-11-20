import { useState } from "react";
import "./LoginPage.css";

const API_URL = "http://localhost:3000";

export default function LoginPage({ onLogin }) {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!userId.trim() || !password.trim()) {
      setError("아이디와 비밀번호를 입력해주세요.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(
        `${API_URL}/user?ID=${encodeURIComponent(userId.trim())}&PASSWORD=${encodeURIComponent(password)}`
      );
      if (!res.ok) throw new Error("서버 오류");
      const users = await res.json();

      if (users.length === 0) {
        setError("아이디 또는 비밀번호가 맞지 않아요.");
        return;
      }

      // 비밀번호는 빼고 저장
      const loginUser = { id: users[0].ID, userNm: users[0].USER_NM };
      localStorage.setItem("loginUser", JSON.stringify(loginUser));
      onLogin(loginUser);
    } catch {
      setError("서버에 연결할 수 없어요. json-server가 켜져 있는지 확인해주세요.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-visual">
          <div className="login-book">
            <span className="login-book-title">별빛 아래의 서점</span>
          </div>
          <p className="login-logo">북커버 AI</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <h1 className="login-title">로그인</h1>
          <p className="login-desc">로그인하고 내 도서 목록을 열어보세요.</p>

          <label className="login-label" htmlFor="userId">아이디</label>
          <input
            id="userId"
            className="login-input"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            placeholder="아이디를 입력하세요"
            autoComplete="username"
          />

          <label className="login-label" htmlFor="password">비밀번호</label>
          <input
            id="password"
            type="password"
            className="login-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="비밀번호를 입력하세요"
            autoComplete="current-password"
          />

          {error && <p className="login-error" role="alert">{error}</p>}

          <button type="submit" className="login-button" disabled={loading}>
            {loading ? "로그인 중…" : "로그인"}
          </button>
        </form>
      </div>
    </div>
  );
}
