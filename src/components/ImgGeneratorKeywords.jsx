import { useEffect, useRef, useState } from 'react'
import db from '../../db.json'

function ImgGeneratorKeywords({ title, content, genre_code, api_key, onKeywordsChange }) {
  const [keyword, setKeyword] = useState('')
  const [keywords, setKeywords] = useState([])
  const [isExtracting, setIsExtracting] = useState(false)
  const [extractError, setExtractError] = useState('')
  const hasExtractedKeywords = useRef(false)

  const genre = db.genre.find(
    (item) => String(item.ID) === String(genre_code),
  )?.GENRE_NM ?? ''

  useEffect(() => {
    if (!api_key || hasExtractedKeywords.current) return

    const extractKeywords = async () => {
      hasExtractedKeywords.current = true
      setIsExtracting(true)
      setExtractError('')

      try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${api_key}`,
          },
          body: JSON.stringify({
            model: 'gpt-4.1-mini',
            messages: [
              {
                role: 'system',
                content: '책 정보를 바탕으로 대표 키워드 3~5개를 추출하세요. 반드시 JSON 배열만 반환하세요. 예: ["키워드1", "키워드2", "키워드3"]',
              },
              {
                role: 'user',
                content: `책 제목: ${title}\n줄거리: ${content}\n장르: ${genre}`,
              },
            ],
            temperature: 0.3,
          }),
        })

        if (!response.ok) throw new Error('대표 키워드 추출에 실패했습니다.')

        const data = await response.json()
        const message = data.choices?.[0]?.message?.content?.trim() ?? ''
        const jsonText = message.replace(/^```json\s*|\s*```$/g, '')
        const extractedKeywords = JSON.parse(jsonText)
        const nextKeywords = (Array.isArray(extractedKeywords)
          ? extractedKeywords
          : extractedKeywords.keywords ?? []
        )
          .filter((item) => typeof item === 'string' && item.trim())
          .map((item) => item.trim())
          .slice(0, 5)

        setKeywords([...keywords, ...nextKeywords])
        onKeywordsChange?.(nextKeywords)
      } catch (error) {
        setExtractError(error.message)
        hasExtractedKeywords.current = false
      } finally {
        setIsExtracting(false)
      }
    }

    extractKeywords()
  }, [api_key, content, genre, onKeywordsChange, title])

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
        {isExtracting && <span className='img-gen-keyword'>키워드 자동 추출 중...</span>}
        {extractError && <span role='alert'>{extractError}</span>}
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
