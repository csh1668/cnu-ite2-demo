# ITE2 Demo Frontend

Vite + React + Shadcn UI로 구성된 간단한 게시판 프론트엔드입니다.

## 기술 스택

- **Build Tool**: Vite
- **Framework**: React + TypeScript
- **UI Library**: Shadcn UI (Tailwind CSS 기반)
- **배포**: GitHub Pages (GitHub Actions)

## 로컬 개발

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 빌드
npm run build

# 빌드 결과 미리보기
npm run preview
```

## 환경 변수 설정

`.env.example`을 참고하여 `.env` 파일을 생성하세요:

```bash
VITE_API_URL=http://localhost:3000
```

배포 시에는 GitHub Secrets에 `VITE_API_URL`을 설정해야 합니다.

## GitHub Pages 배포

### 1. GitHub Pages 설정

1. GitHub 저장소 > Settings > Pages
2. Source를 "GitHub Actions"로 선택

### 2. GitHub Secrets 설정

1. GitHub 저장소 > Settings > Secrets and variables > Actions
2. New repository secret 클릭
3. Name: `VITE_API_URL`
4. Value: 배포된 백엔드 URL (예: `https://your-backend.vercel.app`)

### 3. 자동 배포

`main` 브랜치에 푸시하면 자동으로 배포됩니다:

```bash
git add .
git commit -m "feat: 게시판 기능 추가"
git push origin main
```

배포 주소: `https://csh1668.github.io/ite2`

## 주요 기능

- 게시글 목록 조회
- 게시글 작성
- 게시글 상세 보기
- 게시글 삭제
- 댓글 작성 및 조회
- 댓글 삭제
- 반응형 디자인
- 모던한 UI/UX (Shadcn UI)


