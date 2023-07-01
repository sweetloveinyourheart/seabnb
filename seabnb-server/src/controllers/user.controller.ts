import { NextFunction, Request, Response } from "express"
import { Exception } from "../middlewares/globalExeception"
import * as UserServices from '../services/user.service'

export async function getUserInfo(request: Request, response: Response, next: NextFunction) {
    try {
        if (!request.user) {
            throw new Exception({ statusCode: 401, message: 'Unauthorized' })
        }

        const result = await UserServices.getUserInfo(request.user)

        return response.status(200).json(result)
    } catch (error) {
        return next(error)
    }
}