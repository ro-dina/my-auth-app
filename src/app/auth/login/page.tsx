'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import GoogleLoginButton from '../../../../components/GoogleLoginButton'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({})
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})

    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    })

    if (res?.ok) {
      router.push('/profile') // 認証成功後のリダイレクト
    } else {
      if (res?.error?.includes("Invalid")) {
        setErrors({ email: "メールアドレスかパスワードが正しくありません" })
      } else {
        alert(res?.error || "ログインに失敗しました")
      }
    }
  }

  return (
    <div className="max-w-md mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-4">ログイン</h1>
      <form onSubmit={handleLogin} className="flex flex-col gap-4">
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

      <div className="mt-6">
        <GoogleLoginButton />
      </div>

      <div className="text-sm text-gray-500 mt-6">
        <a href="/terms" className="underline mr-4">利用規約</a>
        <a href="/privacy" className="underline">プライバシーポリシー</a>
      </div>

    </div>
  )
}