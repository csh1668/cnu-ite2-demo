# ITE2 Demo - 토이프로젝트 배포 데모


## 프로젝트 구조

```
cnu-ite2-demo/
├── frontend/          # Vite + React + Shadcn UI → GitHub Pages
│   ├── src/
│   ├── package.json
│   └── vite.config.ts
├── backend/           # Elysia.js → Vercel
│   ├── src/
│   │   └── index.ts
│   ├── package.json
│   └── vercel.json
└── .github/
    └── workflows/
        └── deploy.yml # GitHub Actions
```

## 기술 스택

### 프론트엔드
- **Build Tool**: Vite
- **Framework**: React + TypeScript
- **UI Library**: Shadcn UI (Tailwind CSS)
- **배포**: GitHub Pages
- **CI/CD**: GitHub Actions

### 백엔드
- **Framework**: Elysia.js
- **Runtime**: Node.js
- **Storage**: 메모리 (데모용)
- **배포**: Vercel (서버리스)

## 주요 기능

- ✅ 게시글 CRUD (Create, Read, Delete)
- ✅ 댓글 기능 (작성, 조회, 삭제)
- ✅ 반응형 디자인
- ✅ Git push로 자동 배포
- ✅ 서버리스 백엔드
- ✅ 무료 호스팅

## 배포 가이드

### 1. 백엔드 배포 (Vercel)

1. [Vercel](https://vercel.com) 계정 생성/로그인
2. "New Project" 클릭
3. GitHub 저장소 연결
4. 프로젝트 설정:
   - **Root Directory**: `backend`
   - **Framework Preset**: Other
   - Vercel이 `vercel.json`의 설정을 자동 인식
5. Deploy 클릭

배포 후 URL을 복사하세요 (예: `https://your-backend.vercel.app`)

**동작 방식**: Bun Build Output API를 사용하여 Node.js 22.x 서버리스 함수로 배포됩니다.

### 2. 프론트엔드 배포 (GitHub Pages)

1. GitHub 저장소 > Settings > Pages
2. Source를 "GitHub Actions"로 선택
3. GitHub 저장소 > Settings > Secrets and variables > Actions
4. New repository secret:
   - Name: `VITE_API_URL`
   - Value: 위에서 복사한 Vercel URL
5. `main` 브랜치에 푸시:

```bash
git add .
git commit -m "feat: 게시판 기능 추가"
git push origin main
```

배포 주소: `https://csh1668.github.io/cnu-ite2-demo/`

## 로컬 개발

### 백엔드

먼저 [Bun을 설치](https://bun.sh)하세요:
```bash
# Windows
powershell -c "irm bun.sh/install.ps1|iex"
```

그 다음:
```bash
cd backend
bun install
bun run dev
```

서버: http://localhost:3000

### 프론트엔드

```bash
cd frontend
npm install
npm run dev
```

서버: http://localhost:5173