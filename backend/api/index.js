import { Elysia, t } from "elysia";
import { cors } from "@elysiajs/cors";

//#region src/index.ts
let posts = [{
	id: 1,
	title: "ㅎㅇㅎㅇ",
	content: "굿",
	author: "ㅇㅇ",
	createdAt: (/* @__PURE__ */ new Date()).toISOString()
}];
let comments = [{
	id: 1,
	postId: 1,
	content: "굿굿",
	author: "ㅁㅁ",
	createdAt: (/* @__PURE__ */ new Date()).toISOString()
}];
let nextPostId = 2;
let nextCommentId = 2;
const app = new Elysia().use(cors({
	origin: true,
	methods: [
		"GET",
		"POST",
		"DELETE"
	]
})).get("/api/posts", () => {
	return {
		success: true,
		data: posts.sort((a, b) => b.id - a.id)
	};
}).get("/api/posts/:id", ({ params: { id }, set }) => {
	const post = posts.find((p) => p.id === parseInt(id));
	if (!post) {
		set.status = 404;
		return {
			success: false,
			message: "게시글을 찾을 수 없습니다."
		};
	}
	return {
		success: true,
		data: post
	};
}).post("/api/posts", ({ body }) => {
	const newPost = {
		id: nextPostId++,
		title: body.title,
		content: body.content,
		author: body.author,
		createdAt: (/* @__PURE__ */ new Date()).toISOString()
	};
	posts.push(newPost);
	return {
		success: true,
		data: newPost
	};
}, { body: t.Object({
	title: t.String({
		minLength: 1,
		maxLength: 100
	}),
	content: t.String({
		minLength: 1,
		maxLength: 5e3
	}),
	author: t.String({
		minLength: 1,
		maxLength: 50
	})
}) }).delete("/api/posts/:id", ({ params: { id }, set }) => {
	const postId = parseInt(id);
	const index = posts.findIndex((p) => p.id === postId);
	if (index === -1) {
		set.status = 404;
		return {
			success: false,
			message: "게시글을 찾을 수 없습니다."
		};
	}
	posts.splice(index, 1);
	comments = comments.filter((c) => c.postId !== postId);
	return {
		success: true,
		message: "게시글이 삭제되었습니다."
	};
}).get("/api/posts/:id/comments", ({ params: { id } }) => {
	const postComments = comments.filter((c) => c.postId === parseInt(id)).sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
	return {
		success: true,
		data: postComments
	};
}).post("/api/posts/:id/comments", ({ params: { id }, body, set }) => {
	const postId = parseInt(id);
	const post = posts.find((p) => p.id === postId);
	if (!post) {
		set.status = 404;
		return {
			success: false,
			message: "게시글을 찾을 수 없습니다."
		};
	}
	const newComment = {
		id: nextCommentId++,
		postId,
		content: body.content,
		author: body.author,
		createdAt: (/* @__PURE__ */ new Date()).toISOString()
	};
	comments.push(newComment);
	return {
		success: true,
		data: newComment
	};
}, { body: t.Object({
	content: t.String({
		minLength: 1,
		maxLength: 1e3
	}),
	author: t.String({
		minLength: 1,
		maxLength: 50
	})
}) }).delete("/api/comments/:id", ({ params: { id }, set }) => {
	const index = comments.findIndex((c) => c.id === parseInt(id));
	if (index === -1) {
		set.status = 404;
		return {
			success: false,
			message: "댓글을 찾을 수 없습니다."
		};
	}
	comments.splice(index, 1);
	return {
		success: true,
		message: "댓글이 삭제되었습니다."
	};
}).get("/", () => {
	return {
		message: "ITE2 Demo Backend API",
		endpoints: {
			"GET /api/posts": "게시글 목록 조회",
			"GET /api/posts/:id": "게시글 상세 조회",
			"POST /api/posts": "게시글 작성",
			"DELETE /api/posts/:id": "게시글 삭제",
			"GET /api/posts/:id/comments": "댓글 목록 조회",
			"POST /api/posts/:id/comments": "댓글 작성",
			"DELETE /api/comments/:id": "댓글 삭제"
		}
	};
});
if (import.meta.env?.DEV || process.env.NODE_ENV !== "production") {
	app.listen(process.env.PORT || 3e3);
	console.log(`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`);
}
var src_default = app;

//#endregion
export { src_default as default };