// 내 부품 미리보기 전용 시작 파일 (팀 App.jsx와 상관없음)
// 실행: npm run dev 후 http://localhost:5173/preview.html
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import UiPreview from './UiPreview';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <UiPreview />
  </StrictMode>
);
