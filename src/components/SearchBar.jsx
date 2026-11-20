// 검색 줄 (검색어 + 장르 선택 + 검색 버튼) — 조건 조회 담당: 최연진
// genres   : db.json의 genre 목록 [{ GENRE_NM, GENRE_CODE }]
// onSearch : 검색 버튼(또는 Enter)을 눌렀을 때 실행 → onSearch({ keyword, genre })
import { useState } from 'react';
import Input from './Input';
import Select from './Select';
import Button from './Button';

function SearchBar({ genres = [], onSearch = () => {} }) {
  const [keyword, setKeyword] = useState('');
  const [genre, setGenre] = useState('');

  const genreOptions = genres.map((g) => ({ value: g.GENRE_CODE, label: g.GENRE_NM }));

  // form으로 감싸서 Enter를 눌러도 검색되게 함
  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch({ keyword: keyword.trim(), genre });
  };

  return (
    <form className="search-bar" onSubmit={handleSubmit}>
      <div className="search-bar-keyword">
        <Input value={keyword} onChange={setKeyword} placeholder="제목 또는 저자 검색" />
      </div>
      <div className="search-bar-genre">
        <Select value={genre} onChange={setGenre} options={genreOptions} placeholder="장르 전체" />
      </div>
      <Button type="submit" variant="primary">검색</Button>
    </form>
  );
}

export default SearchBar;
