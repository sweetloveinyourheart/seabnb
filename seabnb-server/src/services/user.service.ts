import { Exception } from "../middlewares/globalExeception";
import { IRequestUser } from "../middlewares/jwtAuthGuard";
import UserModel from "../models/user.model";
import { UserInfo } from "../responses/user.response";

export async function getUserInfo(user: IRequestUser): Promise<UserInfo> {
    const userInfo = await UserModel
        .findById(user.id)
        .select(['email', 'isVerified', 'profile'])

    if(!userInfo) {
        throw new Exception({ statusCode: 404, message: 'Profile not found!' })
    }

    return userInfo
}