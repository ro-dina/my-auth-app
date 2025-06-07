// pages/api/follow.ts
import { PrismaClient } from '@prisma/client'
import { NextApiRequest, NextApiResponse } from 'next'
import { verifyToken } from '../../../lib/auth'

const prisma = new PrismaClient()

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const token = req.cookies.token 
    if (typeof token !== 'string') {
        return res.status(401).json({ message: 'Invalid token format'});
    }

    const payload = verifyToken(token)
    if (!payload || typeof payload !== 'object' || !('userId' in payload)) {
        return res.status(401).json({ message: 'Unauthorized' })
    }

    const currentUserId = Number(payload.userId)

    const { targetUserId } = req.body
    if (!targetUserId || typeof targetUserId !== 'number') {
        return res.status(400).json({ message: 'Invalid targetUserId' })
    }

    if (req.method === 'POST') {
        await prisma.follow.create({
        data: {
            followerId: currentUserId,
            followingId: targetUserId,
        },
    })
        return res.status(200).json({ message: 'Followed' })
    }

    if (req.method === 'DELETE') {
        await prisma.follow.deleteMany({
        where: {
            followerId: currentUserId,
            followingId: targetUserId,
        },
    })
        return res.status(200).json({ message: 'Unfollowed' })
    }

    return res.status(405).json({ message: 'Method not allowed' })
}