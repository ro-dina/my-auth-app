// POST ここ(/api/auth/signup)に{ email, password }を送ることでパスワードをハッシュ化しDBにユーザを登録できる。
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'
import { NextApiRequest, NextApiResponse } from 'next'
import { z } from 'zod'

const prisma = new PrismaClient()

//入力
const signupSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8, 'パスワードは8文字以上である必要があります'),
})

export default async function handler(req: NextApiRequest, res: NextApiResponse){
    if (req.method !== 'POST'){
        return res.status(405).json({ message: 'Method not allowed' })
    }

    //zod
    const result = signupSchema.safeParse(req.body)
    if (!result.success) {
        return res.status(400).json({ message: 'Invalid input',  errors: result.error.format() })
    }

    const { email, password } = req.body

    /*if (!email || !password ) {
        return res.status(400).json({ message: 'Email and password are required' })
    }*/

    const existingUser = await prisma.user.findUnique({ where: { email } })
    if (existingUser) {
        return res.status(409).json({ message: 'User already exists' })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await prisma.user.create({
        data: {
            email,
            password: hashedPassword,
        },
    })

    return res.status(201).json({ id: user.id, email: user.email })
}