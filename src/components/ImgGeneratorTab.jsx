import { useEffect, useState } from 'react'

function ImgGeneratorTab() {
  const [isOpen, setIsOpen] = useState(false)

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
        type="button"
        className="image-generator-trigger"
        onClick={() => setIsOpen(true)}
      >
        AI 이미지 생성
      </button>

      {isOpen && (
        <div
          className="image-generator-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setIsOpen(false)
          }}
        >
          <section
            className="image-generator-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="image-generator-title"
          >
            <header className="image-generator-modal-header">
              <div>
                <h2 id="image-generator-title">AI 이미지 생성</h2>
                <p>도서 정보를 바탕으로 표지 이미지를 생성해 보세요.</p>
              </div>
              <button
                type="button"
                className="image-generator-close"
                aria-label="AI 이미지 생성 창 닫기"
                onClick={() => setIsOpen(false)}
              >
                ×
              </button>
            </header>

            <div className="image-generator-modal-body" aria-label="이미지 생성 기능 준비 중">
              {/* 이미지 생성 기능이 이 영역에 추가될 예정입니다. */}
            </div>
          </section>
        </div>
      )}
    </>
  )
}

export default ImgGeneratorTab
