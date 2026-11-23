import { useState } from 'react'

function ImgGeneratorKeywords({ onKeywordsChange }) {
  const [keyword, setKeyword] = useState('')
  const [keywords, setKeywords] = useState([])

  const addKeyword = () => {
    const trimmedKeyword = keyword.trim()

    if (!trimmedKeyword) return

    const nextKeywords = [...keywords, trimmedKeyword]
    setKeywords(nextKeywords)
    onKeywordsChange?.(nextKeywords)
    setKeyword('')
  }

  const removeKeyword = (targetIndex) => {
    const nextKeywords = keywords.filter((_, index) => index !== targetIndex)
    setKeywords(nextKeywords)
    onKeywordsChange?.(nextKeywords)
  }

  const handleKeyDown = (event) => {
    if (event.key !== 'Enter') return

    event.preventDefault()
    addKeyword()
  }

  return (
    <>
      <div className='img-gen-keywords'>
        {keywords.map((item, index) => (
          <span className='img-gen-keyword' key={`${item}-${index}`}>
            {item}
            <button
              type='button'
              className='img-gen-keyword-remove'
              aria-label={`${item} 키워드 삭제`}
              onClick={() => removeKeyword(index)}
            >
              ×
            </button>
          </span>
        ))}
      </div>

      <div className='img-gen-keywords-add'>
        <p>직접 입력</p>
        <input
          value={keyword}
          onChange={(event) => setKeyword(event.target.value)}
          onKeyDown={handleKeyDown}
          aria-label='키워드 직접 입력'
        />
        <button type='button' onClick={addKeyword}>추가</button>
      </div>
    </>
  )
}

export default ImgGeneratorKeywords
