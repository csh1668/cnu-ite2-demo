# ITE2 Demo Backend

Elysia.js 기반의 간단한 게시판 API 백엔드입니다.

## 기술 스택

- **Runtime**: Bun
- **Framework**: Elysia.js
- **배포**: Vercel

## API 엔드포인트

### 게시글
- `GET /api/posts` - 게시글 목록 조회
- `GET /api/posts/:id` - 게시글 상세 조회
- `POST /api/posts` - 게시글 작성
- `DELETE /api/posts/:id` - 게시글 삭제

### 댓글
- `GET /api/posts/:id/comments` - 댓글 목록 조회
- `POST /api/posts/:id/comments` - 댓글 작성
- `DELETE /api/comments/:id` - 댓글 삭제

## 로컬 개발

```bash
# 의존성 설치
bun install

# 개발 서버 실행
bun run dev
```

## Vercel 배포

1. Vercel 계정에 로그인
2. 새 프로젝트 생성
3. GitHub 저장소 연결
4. Root Directory를 `backend`로 설정
5. Framework Preset을 `Other`로 선택
6. Build Command: `bun install`
7. Output Directory: (비워두기)
8. Install Command: `bun install`

## 특징

- 메모리 기반 데이터 저장 (재시작 시 초기화)
- CORS 활성화로 프론트엔드 연동 가능
- 간단한 CRUD API


