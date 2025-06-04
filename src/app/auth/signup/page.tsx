'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function SignupPage() {
    const [email, setEmail ] = useState('')
    const [password, setPassword] = useState('')
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
        } else {
            alert('登録に失敗しました')
        }
    }

    return (
        <div className="max-w-md mx-auto mt-10">
            <h1 className="text-2xl font-bold mb-4">サインアップ</h1>
            <form onSubmit={handleSignup} className="flex flex-col gap-4">
                <input type="email" placeholder='Email' value={email} onChange={e => setEmail(e.target.value)} className="border p-2 rounded" />
                <input type="password" placeholder='Password' value={password} onChange={e => setPassword(e.target.value)} className="border p-2 rounded" />
                <button type="submit" className='bg-blue-600 text-white px-4 py-2 rounded'>登録</button>
            </form>
        </div>
    )
}