'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import GoogleLoginButton from '../../../../components/GoogleLoginButton'
import { Eye, EyeOff } from 'lucide-react'

export default function SignupPage() {
    const [email, setEmail ] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [errors, setErrors] = useState<{ email?: string; password?: string; confirmPassword?: string }>({})
    const [agreed, setAgreed] = useState(false)
    const router = useRouter()

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault()

        setErrors({}) //初期化

        if (!agreed){
            alert("利用規約とプライバシーポリシーに同意する必要があります。")
            return
        }

        if (password !== confirmPassword) {
            setErrors(prev => ({ ...prev, confirmPassword: 'パスワードが一致しません' }))
            return
        }

        const res = await fetch('/api/auth/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        })
        if (res.ok) {
            router.push('/auth/login')
        } else { //zod
            const data = await res.json()
            if (data.errors){
                setErrors({
                    email: data.errors.email?._errors?.[0],
                    password: data.errors.password?._errors?.[0],
                });
            } else {
                alert(data.message || '登録に失敗しました')
            }
        }
    }

    return (
        <div className="max-w-md mx-auto mt-10 p-6 border rounded-lg shadow">
            <h1 className="text-2xl font-bold mb-6 text-center">サインアップ</h1>
            <form onSubmit={handleSignup} className="flex flex-col gap-4">

                <div>
                    <label className="block text-sm font-medium mb-1">メールアドレス</label>
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
                    <label className="block text-sm font-medium mb-1">パスワード</label>
                    <div className="relative">
                        <input
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            className="border p-2 rounded w-full pr-10"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(prev => !prev)}
                            className="absolute right-2 top-2"
                            aria-label="パスワード表示切り替え"
                        >
                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                    </div>
                    {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">パスワード再入力</label>
                    <div className="relative">
                        <input
                            type={showConfirmPassword ? 'text' : 'password'}
                            placeholder='Confirm Password'
                            value={confirmPassword}
                            onChange={e => setConfirmPassword(e.target.value)}
                            className="border p-2 rounded w-full pr-10"
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirmPassword(prev => !prev)}
                            className="absolute right-2 top-2"
                            aria-label="確認用パスワード表示切り替え"
                        >
                            {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                    </div>
                    {errors.confirmPassword && (
                        <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
                    )}
                </div>

                <label className="flex items-start gap-2 text-sm">
                    <input
                        type="checkbox"
                        checked={agreed}
                        onChange={(e) => setAgreed(e.target.checked)}
                        className="mt-1"
                    />
                    <span>
                        <a href="/terms" className="underline mr-2 text-blue-600 hover:text-blue-800" target="_blank">利用規約</a>と
                        <a href="/privacy" className="underline ml-1 text-blue-600 hover:text-blue-800" target="_blank">プライバシーポリシー</a>
                        に同意します。
                        <br />(登録ボタンを押すと規約に同意したものとみなされます)
                    </span>
                </label>

                <button
                    type="submit"
                    className={`px-4 py-2 rounded text-white ${agreed ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'}`}
                    disabled={!agreed}
                >
                    登録
                </button>
            </form>

            <div className="mt-6 text-center">
                <GoogleLoginButton />
            </div>
        </div>
    )
}