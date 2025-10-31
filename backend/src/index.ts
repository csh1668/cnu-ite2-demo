import { Elysia, t } from 'elysia';
import { cors } from '@elysiajs/cors';

// 메모리 기반 게시글 저장소
interface Post {
  id: number;
  title: string;
  content: string;
  author: string;
  createdAt: string;
}

interface Comment {
  id: number;
  postId: number;
  content: string;
  author: string;
  createdAt: string;
}

let posts: Post[] = [
  {
    id: 1,
    title: 'ㅎㅇㅎㅇ',
    content: '굿',
    author: 'ㅇㅇ',
    createdAt: new Date().toISOString(),
  },
];

let comments: Comment[] = [
  {
    id: 1,
    postId: 1,
    content: '굿굿',
    author: 'ㅁㅁ',
    createdAt: new Date().toISOString(),
  },
];

let nextPostId = 2;
let nextCommentId = 2;

const app = new Elysia()
  .use(
    cors({
      origin: true, // 모든 origin 허용 (데모용)
      methods: ['GET', 'POST', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
      credentials: true,
    })
  )
  // OPTIONS 프리플라이트 요청 처리
  .options('/*', ({ set }) => {
    set.status = 200;
    set.headers['Access-Control-Allow-Origin'] = '*';
    set.headers['Access-Control-Allow-Methods'] = 'GET, POST, DELETE, OPTIONS';
    set.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization';
    set.headers['Access-Control-Max-Age'] = '86400';
    return '';
  })
  // 게시글 목록 조회
  .get('/api/posts', () => {
    return {
      success: true,
      data: posts.sort((a, b) => b.id - a.id),
    };
  })
  // 게시글 상세 조회
  .get('/api/posts/:id', ({ params: { id }, set }) => {
    const post = posts.find((p) => p.id === parseInt(id));
    if (!post) {
      set.status = 404;
      return {
        success: false,
        message: '게시글을 찾을 수 없습니다.',
      };
    }
    return {
      success: true,
      data: post,
    };
  })
  // 게시글 작성
  .post(
    '/api/posts',
    ({ body }) => {
      const newPost: Post = {
        id: nextPostId++,
        title: body.title,
        content: body.content,
        author: body.author,
        createdAt: new Date().toISOString(),
      };
      posts.push(newPost);
      return {
        success: true,
        data: newPost,
      };
    },
    {
      body: t.Object({
        title: t.String({ minLength: 1, maxLength: 100 }),
        content: t.String({ minLength: 1, maxLength: 5000 }),
        author: t.String({ minLength: 1, maxLength: 50 }),
      }),
    }
  )
  // 게시글 삭제
  .delete('/api/posts/:id', ({ params: { id }, set }) => {
    const postId = parseInt(id);
    const index = posts.findIndex((p) => p.id === postId);
    if (index === -1) {
      set.status = 404;
      return {
        success: false,
        message: '게시글을 찾을 수 없습니다.',
      };
    }
    posts.splice(index, 1);
    // 해당 게시글의 댓글도 삭제
    comments = comments.filter((c) => c.postId !== postId);
    return {
      success: true,
      message: '게시글이 삭제되었습니다.',
    };
  })
  // 댓글 목록 조회
  .get('/api/posts/:id/comments', ({ params: { id } }) => {
    const postComments = comments
      .filter((c) => c.postId === parseInt(id))
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    return {
      success: true,
      data: postComments,
    };
  })
  // 댓글 작성
  .post(
    '/api/posts/:id/comments',
    ({ params: { id }, body, set }) => {
      const postId = parseInt(id);
      const post = posts.find((p) => p.id === postId);
      if (!post) {
        set.status = 404;
        return {
          success: false,
          message: '게시글을 찾을 수 없습니다.',
        };
      }
      const newComment: Comment = {
        id: nextCommentId++,
        postId: postId,
        content: body.content,
        author: body.author,
        createdAt: new Date().toISOString(),
      };
      comments.push(newComment);
      return {
        success: true,
        data: newComment,
      };
    },
    {
      body: t.Object({
        content: t.String({ minLength: 1, maxLength: 1000 }),
        author: t.String({ minLength: 1, maxLength: 50 }),
      }),
    }
  )
  // 댓글 삭제
  .delete('/api/comments/:id', ({ params: { id }, set }) => {
    const index = comments.findIndex((c) => c.id === parseInt(id));
    if (index === -1) {
      set.status = 404;
      return {
        success: false,
        message: '댓글을 찾을 수 없습니다.',
      };
    }
    comments.splice(index, 1);
    return {
      success: true,
      message: '댓글이 삭제되었습니다.',
    };
  })
  .get('/', () => {
    return {
      message: 'ITE2 Demo Backend API',
      endpoints: {
        'GET /api/posts': '게시글 목록 조회',
        'GET /api/posts/:id': '게시글 상세 조회',
        'POST /api/posts': '게시글 작성',
        'DELETE /api/posts/:id': '게시글 삭제',
        'GET /api/posts/:id/comments': '댓글 목록 조회',
        'POST /api/posts/:id/comments': '댓글 작성',
        'DELETE /api/comments/:id': '댓글 삭제',
      },
    };
  });

// 로컬 개발용
if (import.meta.main) {
  app.listen(process.env.PORT || 3000);
  console.log(
    `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
  );
}

export default app;
