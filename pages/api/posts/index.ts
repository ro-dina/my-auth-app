import { PrismaClient } from "@prisma/client";
import { verifyToken } from "../../../lib/auth";
import { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient()

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST'){
        const token = req.cookies.token;
        if (!token){
            return res.status(401).json({ message: 'Token not found' });
        }
        const payload = verifyToken(token)
        if (!payload || typeof payload !== 'object' || !('userId' in payload)){
            return res.status(401).json({ message: 'Unauthorized' })
        }

        const { content, visibility = "public" } = req.body
        if (!['public', 'private', 'followers' ].includes(visibility)){
            return res.status(400).json({ message: 'Invalid visibility value' })
        }

        const post = await prisma.post.create({
            data: {
                content,
                visibility,
                userId: Number(payload.userId),
            },
            include: {
                user: {
                    select: {
                        email: true,
                    },
                },
            },
        });

        return res.status(201).json(post)
    }

    if (req.method === 'GET'){
        const token = req.cookies.token;
        if (typeof token !== 'string') {
            return res.status(401).json({ message: 'Invalid token'})
        }
        const payload = verifyToken(token)
        const userId = payload && typeof payload == 'object' && 'userId' in payload ? Number(payload.userId) : null

        let followingIds: number[] = []

        if (userId) {
            const follows = await prisma.follow.findMany({
                where: { followerId: userId },
                select: { followingId: true },
            })
            followingIds = follows.map(f => f.followingId)
        }

        const posts = await prisma.post.findMany({
            where: {
            OR: [
                { visibility: 'public' },
                ...(userId
                    ? [
                        { visibility: 'private', userId },         // 自分の非公開投稿
                        { visibility: 'followers', userId: { in: followingIds} },    // フォロー限定投稿
                        ]
                    : []),
                ],
            },
            orderBy: { createdAt: 'desc' },
            include: { user: { select: { id: true, email: true } } },
            })

    return res.status(200).json(posts)
}

    return res.status(405).json({ message: 'Method not allowed'})
}