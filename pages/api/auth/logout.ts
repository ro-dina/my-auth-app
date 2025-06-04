import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse){
    res.setHeader(
        'Set-Cookie', 
        'token=; HttpOnly; Path=/; SameSite=Strict; Max-Age=0; ' 
    )
    return res.status(200).json({ message: 'Logged out'})
}
