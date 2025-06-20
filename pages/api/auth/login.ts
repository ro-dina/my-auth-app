import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'
import { signToken } from '../../../lib/auth'
import { NextApiRequest, NextApiResponse  } from 'next'
import { z } from 'zod'
import { isRateLimited, resetAttempts } from '../../../lib/rateLimit'

const prisma = new PrismaClient()

const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(1, 'パスワードを入力してください')
})

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Email and password are required' })
    }
    
    const result = loginSchema.safeParse(req.body)
    if (!result.success) {
        return res.status(400).json({ message: 'Invalid input', errors: result.error.format() })
    }
    const { email, password } = req.body

    //レートリミットチェック
    const key = req.headers['x-forwarded-for']?.toString() || req.socket.remoteAddress || email
    if (isRateLimited(key)) {
        return res.status(429).json({ message: 'ログイン試行が多すぎます。しばらく待ってから再試行してください。'})
    }

    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' })
    }

    if (!user.password){
        return res.status(401).json({ message: 'Invalid credentials' })
    }
    const isValid = await bcrypt.compare(password, user.password)
    if (!isValid) {
        return res.status(401).json({ message: 'Invalid credentials' })
    }

    const token = signToken({ userId: user.id })
    resetAttempts(key)

    res.setHeader('Set-Cookie', `token=${token}; HttpOnly; Path=/; SameSite=Strict; Max-Age=86400 `)

    return res.status(200).json({ id: user.id, email: user.email })
}