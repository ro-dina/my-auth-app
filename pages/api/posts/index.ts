import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient()

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const session = await getServerSession(req, res, authOptions);
    
    if (!session || !session.user?.id){
        return res.status(401).json({ message: 'Unauthorized' });
    }

    const userId = session.user.id;
    if (typeof userId !== 'string') {
        return res.status(401).json({ message: 'Invalid session user ID' });
    }

    if (req.method === 'POST'){
        const { content, visibility = "public" } = req.body;

        if (!['public', 'private', 'followers'].includes(visibility)){
            return res.status(400).json({ message: 'Invalid visibility value' });
        }

        console.log("Creating post for userId:", userId);

        const post = await prisma.post.create({
            data: {
                content,
                visibility,
                userId: String(userId),
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
        let followingIds: string[] = [];

        const follows = await prisma.follow.findMany({
            where: { followerId: userId },
            select: { followingId: true },
        });

        followingIds = follows.map(f => f.followingId)

        const posts = await prisma.post.findMany({
            where: {
                OR: [
                    { visibility: 'public' },
                    { visibility: 'private', userId },         // 自分の非公開投稿
                    { visibility: 'followers', userId: { in: followingIds} },    // フォロー限定投稿
                ],
            },
            orderBy: { createdAt: 'desc' },
            include: { user: { select: { id: true, email: true } } },
            });

    return res.status(200).json(posts)
}

    return res.status(405).json({ message: 'Method not allowed'})
}