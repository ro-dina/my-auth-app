import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const session = await getServerSession(req, res, authOptions)

    if (!session?.user?.id){
        return res.status(401).json({ message: 'Not authenticated' })
    }

    if (!session?.user?.email) {
        return res.status(401).json({ message: "Not authenticated" })
    }
    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        select: {
            id: true,
            email: true,
            createdAt: true
        },
    });

    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json(session.user)
}