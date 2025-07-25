'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

type User = {
  id: number
  email: string
  createdAt: string
}

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  
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
      setLoading(false)
    }
    fetchUser()
  }, [router]);

  if (loading) {
    return <p className="text-center mt-10">読み込み中...</p>
  }

  if (!user) {
    return null // router.push中
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-4 border rounded shadow">
      <h1 className="text-2xl font-bold mb-4">プロフィール</h1>
      <p><strong>ID:</strong> {user.id}</p>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>登録日:</strong> {new Date(user.createdAt).toLocaleString()}</p>

      <button
        onClick={async () => {
          await fetch('api/auth/logout', {method: 'POST' })
          location.href = '/auth/login'
        }}
        className="mt-6 bg-red-500 text-white px-4 py-2 rounded"
        >
          ログアウト
      </button>

      <button
        onClick={() => 
          router.push('profile/posts')}
          className="px-4 py-2 bg-blue-600 text-white rounded"
          >
          新規投稿
      </button>

    </div>
  )
}
