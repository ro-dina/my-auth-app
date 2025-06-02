import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'
import { signToken } from '../../../lib/auth'
import { NextApiRequest, NextApiResponse  } from 'next'

const prisma = new PrismaClient()

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Email and password are required' })
    }
    
    const { email, password } = req.body

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' })
    }

    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' })
    }

    const isValid = await bcrypt.compare(password, user.password)
    if (!isValid) {
        return res.status(401).json({ message: 'Invalid credentials' })
    }

    const token = signToken({ userId: user.id })

    res.setHeader('Set-Cookie', `token=${token}; HttpOnly; Path=/; SameSite=Strict; Max-Age=86400 `)

    return res.status(200).json({ id: user.id, email: user.email })
}