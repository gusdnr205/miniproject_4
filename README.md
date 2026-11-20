# React + Vite

## 로컬 조회 API

프로젝트 루트에서 `npm ci`로 의존성을 설치한 뒤 `npm run dev:api`를 실행합니다. React 개발 서버는 다른 터미널에서 `npm run dev`로 실행할 수 있습니다.

기본 주소는 `http://127.0.0.1:3001`입니다.

| GET 경로 | 용도 |
| --- | --- |
| `/books` | 전체 도서 목록 |
| `/books/1` | 숫자 `ID`로 도서 한 권 조회 |
| `/books?AUTHOR_ID=demo-seoyun&GENRE=1` | 작성자와 장르로 필터링 |
| `/user?USER_ID=demo-seoyun` | 샘플 유저 조회 |
| `/genre` | 장르 전체 조회 |
| `/genre?GENRE_CODE=1` | 장르 코드로 조회 |

`db.json`의 도서 `GENRE`는 장르의 `GENRE_CODE`와 연결됩니다. 샘플 유저의 `PASSWORD`와 도서의 `COVER_IMAGE_URL`은 빈 문자열입니다. 이 서버에서는 GET 조회만 지원합니다.

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and Oxlint's TypeScript related rules in your project.
