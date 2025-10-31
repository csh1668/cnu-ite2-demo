# ITE2 Demo Backend

Elysia.js 기반의 간단한 게시판 API 백엔드입니다.

## 기술 스택

- **Framework**: Elysia.js
- **개발 Runtime**: Bun (로컬)
- **배포 Runtime**: Node.js (Vercel)
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

### 사전 준비
Bun을 설치하세요:

**Windows (PowerShell):**
```bash
powershell -c "irm bun.sh/install.ps1|iex"
```

**macOS/Linux:**
```bash
curl -fsSL https://bun.sh/install | bash
```

### 개발 서버 실행

```bash
# 의존성 설치
bun install

# 개발 서버 실행
bun run dev

# Vercel 배포용 빌드
bun run build
```

## Vercel 배포

### Vercel Dashboard 사용 (권장)

1. [Vercel](https://vercel.com) 계정에 로그인
2. "New Project" 클릭
3. GitHub 저장소 연결
4. 프로젝트 설정:
   - **Root Directory**: `backend`
   - **Framework Preset**: Other
   - Vercel이 `vercel.json`의 `buildCommand`를 자동 인식
5. "Deploy" 클릭

### 동작 원리 (Build Output API)

빌드 프로세스:
1. `bun run build` 실행 → `scripts/vercel-build.ts` 실행
2. Bun이 `src/index.ts`를 번들링 → Node.js 호환 ESM 생성
3. `.vercel/output/` 구조 생성:
   ```
   .vercel/output/
   ├── config.json              # 라우팅 설정
   └── functions/
       └── index.func/
           ├── index.js         # 번들된 코드
           ├── .vc-config.json  # Node.js 22.x 런타임
           └── package.json     # ESM 설정
   ```
4. Vercel이 Build Output API 형식을 인식하여 서버리스 함수로 배포

### Vercel CLI 사용

```bash
cd backend
bun install
bun run build
vercel deploy
```

### 주의사항

- **메모리 데이터**: 서버리스 함수는 상태를 유지하지 않으므로 메모리 데이터가 요청 간 공유되지 않을 수 있습니다
- **프로덕션**: 실제 운영 환경에서는 Vercel Postgres, Supabase, PlanetScale 등의 데이터베이스 사용을 권장합니다
- **무료 플랜**: 함수 실행 시간 10초, 월 100GB 대역폭 제한

## 특징

- 메모리 기반 데이터 저장 (재시작 시 초기화)
- CORS 활성화로 프론트엔드 연동 가능
- 간단한 CRUD API


