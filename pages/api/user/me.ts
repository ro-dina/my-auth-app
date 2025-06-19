//ここのエンドポイントにGETを送ればログイン中のユーザー情報が取得できる。
import { PrismaClient } from '@prisma/client'
import { verifyToken } from '../../../lib/auth'
import { NextApiRequest, NextApiResponse } from 'next'

const prisma = new PrismaClient()

export default async function handler(req: NextApiRequest, res: NextApiResponse){
    const token = req.cookies.token

    if (!token) {
        return res.status(401).json({ message: 'Not authenticated' })
    }

    const payload = verifyToken(token)
    if (!payload || typeof payload !== 'object' || !('userId' in payload)) {
        return res.status(401).json({ message: 'Invalid token'})
    }

    const user = await prisma.user.findUnique({
        where: { id: payload.userId },
        select: { id: true, email: true, createdAt: true },
    })

    if (!user) {
        return res.status(404).json({ message: 'User not found' })
    }
    return res.status(200).json(user)
}