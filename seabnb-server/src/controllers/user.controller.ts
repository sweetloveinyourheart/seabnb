import { NextFunction, Request, Response } from "express"
import { Exception } from "../middlewares/globalExeception"
import * as UserServices from '../services/user.service'
import { UpdateProfileDto } from "../dtos/user.dto"

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

export async function updateUserProfile(request: Request, response: Response, next: NextFunction) {
    try {
        if (!request.user) {
            throw new Exception({ statusCode: 401, message: 'Unauthorized' })
        }

        const newProfile = new UpdateProfileDto()
        newProfile.username = request.body?.username
        newProfile.firstName = request.body?.firstName
        newProfile.lastName = request.body?.lastName
        newProfile.birthday = request.body?.birthday
        newProfile.address = request.body?.address
        newProfile.phoneNumber = request.body?.phoneNumber

        const result = await UserServices.updateUserProfile(request.user, newProfile)

        return response.status(201).json(result)
    } catch (error) {
        return next(error)
    }
}