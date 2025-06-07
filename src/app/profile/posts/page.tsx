'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

type User = {
  id: number
  email: string
  createdAt: string
}

type Post = {
  id: number
  content: string
  createdAt: string
  user:{
    email: string
  }
}

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null)
  const [content, setContent] = useState('')
  const [posts, setPosts] = useState<Post[]>([])
  const [ visibility, setVisibility] = useState('public')

  const router = useRouter()

  useEffect(() => {
    const fetchUser = async () => {
      const res = await fetch('/api/user/me')
      if (res.ok) {
        const data = await res.json()
        setUser(data)
      } else {
        router.push('/auth/login')
      }
    }

    const fetchPosts = async () => {
      const res = await fetch('/api/posts')
      if (res.ok) {
        const data = await res.json()
        setPosts(data)
      }
    }

    fetchUser()
    fetchPosts()
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const res = await fetch('/api/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content, visibility }),
    })
    if (res.ok) {
      setContent('')
      setVisibility('public')
      const newPost = await res.json()
      setPosts(prev => [newPost, ...prev])
    } else {
      alert('投稿に失敗しました')
    }
  }

  if (!user) return null

  return (
    <div className="max-w-xl mx-auto mt-10 p-4">
      <h1 className="text-2xl font-bold mb-4">こんにちは、{user.email}</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 mb-8">
        <textarea
          value={content}
          onChange={e => setContent(e.target.value)}
          placeholder="投稿内容を入力..."
          className="p-2 border rounded"
        />
        <select
          value={visibility}
          onChange={e => setVisibility(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="public">公開</option>
          <option value="private">非公開</option>
          <option value="followers">フォロワー限定</option>
        </select>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          投稿
        </button>
      </form>

      <button 
          onClick={() =>
            router.push('./')}
            className="bg-green-600 text-white px-4 py-2 rounded">
          プロフィールに戻る
        </button>

      <div className="space-y-4">
        {posts.map((post) => (
          <div key={post.id} className="p-4 border rounded shadow">
            <p>{post.content}</p>
            <small className="text-gray-500">
              by {post.user?.email ?? 'Unknow'}</small>
          </div>
        ))}
      </div>
    </div>
  )
}