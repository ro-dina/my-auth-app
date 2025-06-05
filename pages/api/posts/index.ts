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

        const { content } = req.body
        if (!content){
            return res.status(400).json({ message: 'Content is required' })
        }

        const post = await prisma.post.create({
            data: {
                content,
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
        const posts = await prisma.post.findMany({
            orderBy: { createdAt: 'desc'},
            include: { user: { select: { id: true, email: true } } },
        })
        return res.status(200).json(posts)
    }

    return res.status(405).json({ message: 'Method not allowed'})
}