import jwt from 'jsonwebtoken'

const SECRET = process.env.JWT_SECRET || 'dev-secret'

export function signToken(payload: object, expiresIn: jwt.SignOptions['expiresIn'] = '1d'): string {
    const options: jwt.SignOptions = { expiresIn }
    return jwt.sign(payload, SECRET, options)
}

export function verifyToken(token: string) {
    try {
        return jwt.verify(token, SECRET)
    } catch {
        return null
    }
}