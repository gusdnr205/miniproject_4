// 부품 미리보기 화면 (내 작업 확인용 — 팀 코드 아님)
import { useState } from 'react';
import Button from './components/Button';
import Input from './components/Input';
import TextArea from './components/TextArea';
import Select from './components/Select';
import Checkbox from './components/Checkbox';
import CoverImage from './components/CoverImage';
import Tag from './components/Tag';
import './styles/atoms.css';

const genreOptions = [
  { value: 1, label: '소설' },
  { value: 2, label: '시/에세이' },
  { value: 19, label: '여행' },
];

// 샘플 표지 (진짜 AI 그림 대신 쓰는 단색 그림)
const sampleCover =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="200" height="300"><rect width="200" height="300" fill="#1f3a5f"/><circle cx="100" cy="110" r="28" fill="#e8b96a"/></svg>');

function Section({ title, children }) {
  return (
    <section style={{ marginBottom: 32 }}>
      <h2 style={{ fontSize: 16, marginBottom: 12 }}>{title}</h2>
      <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', flexWrap: 'wrap' }}>{children}</div>
    </section>
  );
}

function UiPreview() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [genre, setGenre] = useState('');
  const [checked, setChecked] = useState(false);

  return (
    <main style={{ maxWidth: 900, margin: '40px auto', padding: '0 20px', fontFamily: 'sans-serif', textAlign: 'left' }}>
      <h1 style={{ fontSize: 24, marginBottom: 24 }}>UI 부품 미리보기</h1>

      <Section title="Button">
        <Button onClick={() => alert('기본 버튼')}>취소</Button>
        <Button variant="primary">등록</Button>
        <Button variant="danger">삭제</Button>
        <Button variant="primary" disabled>비활성</Button>
      </Section>

      <Section title="Input / TextArea">
        <div style={{ width: 300 }}>
          <Input value={title} onChange={setTitle} placeholder="도서 제목을 입력하세요" error={title === ' '} />
        </div>
        <div style={{ width: 300 }}>
          <Input value="" onChange={() => {}} placeholder="에러 상태 예시" error />
        </div>
        <div style={{ width: 612 }}>
          <TextArea value={content} onChange={setContent} placeholder="도서 내용을 입력하세요" />
        </div>
      </Section>

      <Section title="Select / Checkbox / Tag">
        <div style={{ width: 200 }}>
          <Select value={genre} onChange={setGenre} options={genreOptions} placeholder="장르를 선택하세요" />
        </div>
        <Checkbox checked={checked} onChange={setChecked} label="전체 선택" />
        <Tag>소설</Tag>
        <Tag>별빛</Tag>
      </Section>

      <Section title="CoverImage">
        <CoverImage url="" size="sm" />
        <CoverImage url={sampleCover} title="별빛 아래의 서점" author="한서윤" size="sm" />
        <CoverImage url={sampleCover} title="별빛 아래의 서점" author="한서윤" size="md" />
      </Section>
    </main>
  );
}

export default UiPreview;
