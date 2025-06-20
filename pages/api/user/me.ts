import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const session = await getServerSession(req, res, authOptions)

    if (!session || !session.user){
        return res.status(401).json({ message: 'Not authenticated'})
    }

    return res.status(200).json(session.user)
}