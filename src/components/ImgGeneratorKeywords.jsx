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

  const handleSubmit = (event) => {
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

      <form className='img-gen-keywords-add' onSubmit={handleSubmit}>
        <p>직접 입력</p>
        <input
          value={keyword}
          onChange={(event) => setKeyword(event.target.value)}
          aria-label='키워드 직접 입력'
        />
        <button type='submit'>추가</button>
      </form>
    </>
  )
}

export default ImgGeneratorKeywords
