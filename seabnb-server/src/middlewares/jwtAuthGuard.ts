import { NextFunction, Request, Response } from "express"
import * as jwt from "jsonwebtoken"

declare global {
    namespace Express {
        export interface Request {
            user?: IRequestUser
        }
    }
}

export interface IRequestUser {
    id: string
    email: string
}

export function AuthGuard(req: Request, res: Response, next: NextFunction) {
    try {
        const authHeader = req.header('Authorization')
        const token = authHeader && authHeader.split(' ')[1]

        if (!token) return res.sendStatus(401)

        const secret = process.env.JWT_SECRET || "";
        const decoded: any = jwt.verify(token, secret)

        const user: IRequestUser = {
            id: decoded.sub,
            email: decoded.email
        }
        req.user = user

        next()
    } catch (error) {
        return res.sendStatus(403)
    }
}