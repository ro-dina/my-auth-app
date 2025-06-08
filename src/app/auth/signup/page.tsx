'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function SignupPage() {
    const [email, setEmail ] = useState('')
    const [password, setPassword] = useState('')
    const [errors, setErrors] = useState<{ email?: string; password?: string }>({})
    const router = useRouter()

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault()
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
                })
            }alert(data.message || '登録に失敗しました')
        }
    }

    return (
        <div className="max-w-md mx-auto mt-10">
            <h1 className="text-2xl font-bold mb-4">サインアップ</h1>
            <form onSubmit={handleSignup} className="flex flex-col gap-4">

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
                <button type="submit" className='bg-blue-600 text-white px-4 py-2 rounded'>登録</button>
            </form>
        </div>
    )
}