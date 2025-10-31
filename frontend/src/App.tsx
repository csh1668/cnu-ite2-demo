import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { PlusCircle, Trash2, Eye } from 'lucide-react'

// API URL - 환경변수로 관리하거나 배포 후 실제 Vercel URL로 변경
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

interface Post {
  id: number
  title: string
  content: string
  author: string
  createdAt: string
}

interface Comment {
  id: number
  postId: number
  content: string
  author: string
  createdAt: string
}

function App() {
  const [posts, setPosts] = useState<Post[]>([])
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingComments, setLoadingComments] = useState(false)
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [showDetailDialog, setShowDetailDialog] = useState(false)
  const [selectedPost, setSelectedPost] = useState<Post | null>(null)
  
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    author: '',
  })

  const [commentFormData, setCommentFormData] = useState({
    content: '',
    author: '',
  })

  // 게시글 목록 조회
  const fetchPosts = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${API_URL}/api/posts`)
      const result = await response.json()
      if (result.success) {
        setPosts(result.data)
      }
    } catch (error) {
      console.error('게시글 조회 실패:', error)
      alert('게시글을 불러오는데 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }

  // 게시글 작성
  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.title || !formData.content || !formData.author) {
      alert('모든 필드를 입력해주세요.')
      return
    }

    try {
      const response = await fetch(`${API_URL}/api/posts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })
      
      const result = await response.json()
      
      if (result.success) {
        setFormData({ title: '', content: '', author: '' })
        setShowCreateDialog(false)
        fetchPosts()
      }
    } catch (error) {
      console.error('게시글 작성 실패:', error)
      alert('게시글 작성에 실패했습니다.')
    }
  }

  // 게시글 삭제
  const handleDeletePost = async (id: number) => {
    if (!confirm('정말로 삭제하시겠습니까?')) return

    try {
      const response = await fetch(`${API_URL}/api/posts/${id}`, {
        method: 'DELETE',
      })
      
      const result = await response.json()
      
      if (result.success) {
        fetchPosts()
      }
    } catch (error) {
      console.error('게시글 삭제 실패:', error)
      alert('게시글 삭제에 실패했습니다.')
    }
  }

  // 댓글 목록 조회
  const fetchComments = async (postId: number) => {
    try {
      setLoadingComments(true)
      const response = await fetch(`${API_URL}/api/posts/${postId}/comments`)
      const result = await response.json()
      if (result.success) {
        setComments(result.data)
      }
    } catch (error) {
      console.error('댓글 조회 실패:', error)
      alert('댓글을 불러오는데 실패했습니다.')
    } finally {
      setLoadingComments(false)
    }
  }

  // 댓글 작성
  const handleCreateComment = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!selectedPost || !commentFormData.content || !commentFormData.author) {
      alert('모든 필드를 입력해주세요.')
      return
    }

    try {
      const response = await fetch(`${API_URL}/api/posts/${selectedPost.id}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(commentFormData),
      })
      
      const result = await response.json()
      
      if (result.success) {
        setCommentFormData({ content: '', author: '' })
        fetchComments(selectedPost.id)
      }
    } catch (error) {
      console.error('댓글 작성 실패:', error)
      alert('댓글 작성에 실패했습니다.')
    }
  }

  // 댓글 삭제
  const handleDeleteComment = async (commentId: number) => {
    if (!confirm('정말로 삭제하시겠습니까?')) return

    try {
      const response = await fetch(`${API_URL}/api/comments/${commentId}`, {
        method: 'DELETE',
      })
      
      const result = await response.json()
      
      if (result.success && selectedPost) {
        fetchComments(selectedPost.id)
      }
    } catch (error) {
      console.error('댓글 삭제 실패:', error)
      alert('댓글 삭제에 실패했습니다.')
    }
  }

  // 게시글 상세 보기
  const handleViewPost = (post: Post) => {
    setSelectedPost(post)
    setShowDetailDialog(true)
    fetchComments(post.id)
  }

  useEffect(() => {
    fetchPosts()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* 헤더 */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-3">
            게시판
          </h1>
          <p className="text-slate-600 text-lg mb-2">
            Vercel과 GitHub Pages를 활용한 토이프로젝트 배포 데모
          </p>
        </div>

        {/* 작성 버튼 */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-slate-800">게시글 목록</h2>
          <Button onClick={() => setShowCreateDialog(true)}>
            <PlusCircle className="w-4 h-4 mr-2" />
            글 작성
          </Button>
        </div>

        {/* 게시글 목록 */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-slate-500">로딩 중...</p>
          </div>
        ) : posts.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-slate-500">아직 게시글이 없습니다.</p>
              <p className="text-sm text-slate-400 mt-2">첫 번째 글을 작성해보세요!</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {posts.map((post) => (
              <Card key={post.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="text-xl mb-2">{post.title}</CardTitle>
                      <CardDescription>
                        작성자: {post.author} · {new Date(post.createdAt).toLocaleDateString('ko-KR')}
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleViewPost(post)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => handleDeletePost(post.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600 line-clamp-2">{post.content}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* 글 작성 다이얼로그 */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>새 게시글 작성</DialogTitle>
            <DialogDescription>
              간단한 게시글을 작성해보세요.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreatePost} className="space-y-4 mt-4">
            <div>
              <Label htmlFor="title">제목</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="제목을 입력하세요"
                className="mt-1.5"
              />
            </div>
            <div>
              <Label htmlFor="content">내용</Label>
              <Textarea
                id="content"
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="내용을 입력하세요"
                className="mt-1.5"
                rows={6}
              />
            </div>
            <div>
              <Label htmlFor="author">작성자</Label>
              <Input
                id="author"
                value={formData.author}
                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                placeholder="이름을 입력하세요"
                className="mt-1.5"
              />
            </div>
            <div className="flex gap-2 justify-end pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setShowCreateDialog(false)}
              >
                취소
              </Button>
              <Button type="submit">작성하기</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* 상세 보기 다이얼로그 */}
      <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {selectedPost && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedPost.title}</DialogTitle>
                <DialogDescription>
                  작성자: {selectedPost.author} · {new Date(selectedPost.createdAt).toLocaleString('ko-KR')}
                </DialogDescription>
              </DialogHeader>
              
              {/* 게시글 내용 */}
              <div className="mt-4 py-4 border-b">
                <p className="text-slate-700 whitespace-pre-wrap">{selectedPost.content}</p>
              </div>

              {/* 댓글 섹션 */}
              <div className="mt-6">
                <h3 className="font-semibold text-lg mb-4">
                  댓글 {comments.length}개
                </h3>

                {/* 댓글 목록 */}
                <div className="space-y-3 mb-6 max-h-60 overflow-y-auto">
                  {loadingComments ? (
                    <p className="text-sm text-slate-500 text-center py-4">댓글 로딩 중...</p>
                  ) : comments.length === 0 ? (
                    <p className="text-sm text-slate-500 text-center py-4">
                      첫 번째 댓글을 작성해보세요!
                    </p>
                  ) : (
                    comments.map((comment) => (
                      <div 
                        key={comment.id} 
                        className="bg-slate-50 rounded-lg p-3 relative group"
                      >
                        <div className="flex justify-between items-start mb-1">
                          <p className="font-medium text-sm text-slate-900">{comment.author}</p>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-slate-500">
                              {new Date(comment.createdAt).toLocaleString('ko-KR')}
                            </span>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={() => handleDeleteComment(comment.id)}
                            >
                              <Trash2 className="w-3 h-3 text-red-500" />
                            </Button>
                          </div>
                        </div>
                        <p className="text-sm text-slate-700">{comment.content}</p>
                      </div>
                    ))
                  )}
                </div>

                {/* 댓글 작성 폼 */}
                <form onSubmit={handleCreateComment} className="space-y-3 border-t pt-4">
                  <div>
                    <Label htmlFor="comment-author" className="text-sm">작성자</Label>
                    <Input
                      id="comment-author"
                      value={commentFormData.author}
                      onChange={(e) => setCommentFormData({ ...commentFormData, author: e.target.value })}
                      placeholder="이름을 입력하세요"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="comment-content" className="text-sm">댓글</Label>
                    <Textarea
                      id="comment-content"
                      value={commentFormData.content}
                      onChange={(e) => setCommentFormData({ ...commentFormData, content: e.target.value })}
                      placeholder="댓글을 입력하세요"
                      className="mt-1"
                      rows={3}
                    />
                  </div>
                  <div className="flex justify-end">
                    <Button type="submit" size="sm">댓글 작성</Button>
                  </div>
                </form>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default App


