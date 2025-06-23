'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import GoogleLoginButton from '../../../../components/GoogleLoginButton'
import { Eye, EyeOff } from 'lucide-react'
import { z } from "zod"

export default function SignupPage() {
    const [email, setEmail ] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    //const [passwordStrength, setPasswordStrength] = useState(0)
    const [errors, setErrors] = useState<{ email?: string; password?: string; confirmPassword?: string }>({})
    const [agreed, setAgreed] = useState(false)
    const router = useRouter()

    const signupSchema = z.object({
        email: z.string().email("有効なメールアドレスを入力してください"),
        password: z.string().min(8, "8文字以上で入力してください"),
        confirmPassword: z.string(),
    }).refine(data => data.password === data.confirmPassword, {
        path: ["confirmPassword"],
        message: "パスワードが一致しません",
    })

    //強度チェック
    const getPasswordStrength = (pwd: string) => {
        let strength = 0
        if (pwd.length >= 8) strength++
        if (/[A-Z]/.test(pwd)) strength++
        if (/[a-z]/.test(pwd)) strength++
        if (/[0-9]/.test(pwd)) strength++
        if (/[^A-Za-z0-9]/.test(pwd)) strength++
        return strength
    }

    const passwordStrength = getPasswordStrength(password)
    const strengthLabel = ['弱い', 'やや弱い', '普通', 'やや強い', '強力'][passwordStrength - 1] || ''

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault()

        setErrors({}) //初期化

        if (!agreed){
            alert("利用規約とプライバシーポリシーに同意する必要があります。")
            return
        }

        /*
        if (password !== confirmPassword) {
            setErrors(prev => ({ ...prev, confirmPassword: 'パスワードが一致しません' }))
            return
        }
        */
        const result = signupSchema.safeParse({ email, password, confirmPassword })
        if (!result.success) {
            const fieldErrors = result.error.format()
            setErrors({
                email: fieldErrors.email?._errors?.[0],
                password: fieldErrors.password?._errors?.[0],
                confirmPassword: fieldErrors.confirmPassword?._errors?.[0],
            })
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

                    {/* パスワード強度メータ */}
                    {password && (
                        <div className="mt-2">
                            <div className="w-full h-2 bg-gray-200 rounded">
                                <div
                                    className={`h-2 rounded transition-all duration-300`}
                                    style={{
                                        width: `${(passwordStrength / 5) * 100}%`,
                                        backgroundColor: ['#f87171', '#facc15', '#60a5fa', '#38bdf8', '#22c55e'][passwordStrength - 1] || 'transparent',
                                    }}
                                />
                            </div>
                            <p className="text-xs mt-1 text-gray-600">強度: {strengthLabel}</p>
                        </div>
                    )}
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