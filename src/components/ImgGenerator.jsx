import { useState } from 'react'

function ImgGenerator({ title, author, content, cover_image_url, keywords, user_request, button_text, api_key, id, onGenerated }) {
  const OPENAI_IMAGE_API_URL = 'https://api.openai.com/v1/images/generations';
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState('')

  const prompt = `
# 역할
너는 입력된 책 정보와 키워드를 바탕으로 완성도 높은 책 표지 이미지를 만드는 북커버 디자이너다.

# 목표
사용자가 제공한 책 제목, 저자명, 책 소개, 키워드와 디자인 요청을 해석해 책의 주제와 분위기가 잘 드러나는 표지를 만든다. 키워드를 단순히 나열하거나 글자로 배치하는 데 그치지 말고, 핵심 개념을 상징적인 사물, 인물, 풍경, 색상, 빛, 질감, 구도로 시각화한다.

# 입력 정보
- 작업 모드: {{mode}}  // 신규 생성, 기존 표지 수정
- 책 제목: ${title}
- 저자명: ${author}
- 책 소개: ${content}
- 키워드: ${keywords}
- 사용자의 추가 요청: ${user_request}
- 기존 표지 이미지 (base64 url 형식): ${cover_image_url}  // 있을 수도 있고 없을 수도 있음

# 표지 디자인 원칙
1. 결과물은 책의 앞표지 한 장이다. 기본 비율은 세로형 2:3으로 구성한다.
2. 책을 손에 들고 있는 장면, 책등이나 뒷표지, 여러 표지의 모음, 기기 화면 목업은 만들지 않는다. 표지 디자인이 이미지 전체를 채우게 한다.
3. 키워드 사이의 공통 주제와 정서를 파악해 하나의 일관된 시각적 콘셉트로 표현한다. 서로 무관한 요소를 억지로 한 화면에 모두 넣지 않는다.
4. 제목이 제공되면 표지에서 가장 잘 보이는 위치에 정확한 문구로 한 번만 표시한다. 저자명이 제공되면 제목보다 작은 크기로 표시한다.
5. 제목과 저자명은 사용자가 입력한 표기와 띄어쓰기를 그대로 사용한다. 입력되지 않은 제목, 저자명, 출판사명, 문구, 로고, 장식용 글자를 임의로 만들지 않는다.
6. 제목이 제공되지 않았다면 임의의 제목이나 글자를 넣지 않는다. 글자가 없어도 표지가 완성도 있어 보이도록 구성한다.
`.trim()

  const generateImage = async () => {
    if (!api_key) {
      setError('OpenAI API Key를 입력해 주세요.')
      return
    }

    setIsGenerating(true)
    setError('')

    try {
      const res = await fetch(OPENAI_IMAGE_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${api_key}`,
        },
        body: JSON.stringify({
          model: 'gpt-image-2',
          prompt,
          n: 1,
          size: '1024x1536',
          quality: 'auto',
          output_format: 'png',
        }),
      })

      if (!res.ok) throw new Error('OpenAI 이미지 생성 요청에 실패했습니다.')

      const data = await res.json()
      const imageData = data.data?.[0]
      const imageSrc = imageData?.b64_json
        ? `data:image/png;base64,${imageData.b64_json}`
        : imageData?.url

      if (!imageSrc) throw new Error('생성된 이미지 URL을 찾을 수 없습니다.')

      /* DB PATCH는 read-only 개발 환경을 고려해 일단 실행하지 않음
       * 추후 저장 기능을 다시 연결할 때 이 주석을 해제, 하단의 onGenerated?.(imageSrc) 제거
       * const saveRes = await fetch(`http://localhost:3000/books/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          COVER_IMAGE_URL: imageSrc,
        }),
      })

      if (!saveRes.ok) throw new Error('생성된 이미지 저장에 실패했습니다.')

      const savedBook = await saveRes.json()
      onGenerated?.(savedBook.COVER_IMAGE_URL || imageSrc)
      */

      // 우선 DB 저장 없이 생성 결과만 부모 컴포넌트로 전달합니다.
      onGenerated?.(imageSrc)
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div>
      <button type='button' onClick={generateImage} disabled={isGenerating}>
        {isGenerating ? '생성 중...' : button_text}
      </button>
      {error && <p role='alert'>{error}</p>}
    </div>
  )
}



export default ImgGenerator
