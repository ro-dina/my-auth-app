'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import GoogleLoginButton from '../../../../components/GoogleLoginButton'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({})
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({}) //リセット

    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })
    if (res.ok) {
      router.push('/profile') // ログイン後のページへ
    } else {    //zodエラーの受け取り
      const data = await res.json()
      if (data.errors){
        setErrors({
          email: data.errors.email?._errors?.[0],
          password: data.errors.password?._errors?.[0],
        })
      } else {
        alert(data.message || 'ログインに失敗しました')
      }
    }
  }

  return (
    <div className="max-w-md mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-4">ログイン</h1>
      <form onSubmit={handleLogin} className="flex flex-col gap-4">
        {/* zodのユーザーへのデバッグ */}
        <div>       
          <input
            type='email'
            placeholder='Email'
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="border p-2 rounded w-full"
          />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
        </div>

        <div>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="border p-2 rounded w-full"
          />
          {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
        </div>

        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">ログイン</button>
      </form>

      <div className = "mt-6">
        <GoogleLoginButton />
      </div>
    </div>
  )
}