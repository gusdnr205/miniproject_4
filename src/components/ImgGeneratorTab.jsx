import { useEffect, useState } from 'react'
import ImgGeneratorKeywords from './ImgGeneratorKeywords'
import ImgGenerator from './ImgGenerator';

function ImgGeneratorTab({ book, label, onApply }) {
  const [isOpen, setIsOpen] = useState(false)
  const [apiKey, setApiKey] = useState('')
  const [keywords, setKeywords] = useState([])
  const [userRequest, setUserRequest] = useState('')
  const [quality, setQuality] = useState('medium')
  const [generatedCoverImage, setGeneratedCoverImage] = useState('')

  useEffect(() => {
    if (!isOpen) return undefined

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setIsOpen(false)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen])

  return (
    <>
      <button
        type='button'
        className='img-gen-trigger'
        onClick={() => setIsOpen(true)}
      >
        {label}
      </button>

      {isOpen && (
        <div
          className='img-gen-backdrop'
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setIsOpen(false)
          }}
        >
          <section className='img-gen-modal'>
            <header className='img-gen-modal-header'>
              <div>
                <h2 id='img-gen-title'>AI 이미지 생성</h2>
                <p>도서 정보를 바탕으로 표지 이미지를 생성해 보세요.</p>
              </div>
              <button
                type='button'
                className='img-gen-close'
                aria-label='AI 이미지 생성 창 닫기'
                onClick={() => setIsOpen(false)}
              >
                ×
              </button>
            </header>

            <div className='img-gen-modal-body'>
              <div className='img-gen-input'>
                <div>
                  <h3>OpenAI API Key</h3>
                  <input
                    type='password'
                    className='hidden-input'
                    value={apiKey}
                    onChange={(event) => setApiKey(event.target.value)}
                  />
                  <p>입력한 키는 새로고침하면 지워져요.</p>
                </div>
                <div>
                  <h3>표지 생성 키워드</h3>
                  <ImgGeneratorKeywords 
                  title={book.TITLE} content={book.CONTENT} genre_code={book.GENRE} api_key={apiKey} onKeywordsChange={setKeywords} />
                </div>
                <div>
                  <h3>(선택) 추가 요청사항</h3>
                  <textarea
                    className='img-gen-input-userMessage'
                    value={userRequest}
                    onChange={(event) => setUserRequest(event.target.value)}
                  />
                </div>
                <div className='img-gen-actions'>
                  <div className='img-gen-quality'>
                    <span className='img-gen-quality-label'>품질</span>
                    <strong>{quality}</strong>
                    <div
                      className='img-gen-quality-toggle'
                      role='radiogroup'
                      aria-label='이미지 생성 품질'
                      style={{ '--quality-position': `${['low', 'medium', 'high'].indexOf(quality) * 50}%` }}
                    >
                      <span
                        className='img-gen-quality-thumb'
                        style={{ left: `${['low', 'medium', 'high'].indexOf(quality) * 50}%` }}
                      />
                      {['low', 'medium', 'high'].map((option) => (
                        <button
                          key={option}
                          type='button'
                          role='radio'
                          aria-checked={quality === option}
                          aria-label={`${option} 품질`}
                          onClick={() => setQuality(option)}
                        />
                      ))}
                    </div>
                  </div>
                  <ImgGenerator 
                  title={book.TITLE} author={book.AUTHOR_NM} content={book.CONTENT} cover_image_url={book.COVER_IMAGE_URL}
                  keywords={keywords} user_request={userRequest} button_text='신규 생성' api_key={apiKey} id={book.id} quality={quality}
                  onGenerated={setGeneratedCoverImage} />
                  <ImgGenerator 
                  title={book.TITLE} author={book.AUTHOR_NM} content={book.CONTENT} cover_image_url={book.COVER_IMAGE_URL}
                  keywords={keywords} user_request={userRequest} button_text='수정 요청' api_key={apiKey} id={book.id} quality={quality}
                  onGenerated={setGeneratedCoverImage} />
                </div>
              </div>

              <div className='img-gen-compareImg'>
                <div className='img-gen-showImg'>
                  <h3>현재 표지</h3>
                  <img
                    className='img-gen-cover'
                    src={book.COVER_IMAGE_URL || undefined}
                  />
                </div>

                <div className='img-gen-showImg'>
                  <h3>생성된 표지</h3>
                  <img
                    className='img-gen-cover'
                    src={generatedCoverImage || undefined}
                  />
                </div>
              </div>
            </div>

            <footer className='img-gen-modal-footer'>
              <button 
                type='button'
                className='img-gen-cancel'
                onClick={() => setIsOpen(false)}
              >
                취소
              </button>
              <button 
                type='button'
                className='img-gen-apply'
                onClick={() => {
                  if (generatedCoverImage) onApply?.(generatedCoverImage)
                  setGeneratedCoverImage('')
                  setIsOpen(false)
                }}
              >
                새 표지 적용
              </button>
            </footer>
          </section>
        </div>
      )}
    </>
  )
}

export default ImgGeneratorTab
