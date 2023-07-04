import { UpdateProfileDto } from "../dtos/user.dto";
import { Exception } from "../middlewares/globalExeception";
import { IRequestUser } from "../middlewares/jwtAuthGuard";
import UserModel from "../models/user.model";
import { UserInfo } from "../responses/user.response";

export async function getUserInfo(user: IRequestUser): Promise<UserInfo> {
    const userInfo = await UserModel
        .findById(user.id)
        .select(['email', 'isVerified', 'profile'])

    if (!userInfo) {
        throw new Exception({ statusCode: 404, message: 'Profile not found!' })
    }

    return userInfo
}

export async function updateUserProfile(user: IRequestUser, updateData: UpdateProfileDto): Promise<UserInfo> {
    if (updateData.username) {
        const isExist = await UserModel.findOne({ 'profile.username': updateData.username })
        if (isExist) throw new Exception({ statusCode: 400, message: 'Username already exist !' })
    }

    const currentProfile = await UserModel.findById(user.id)
    if (!currentProfile) {
        throw new Exception({ statusCode: 404, message: 'Profile not found!' })
    }

    const newProfile: UpdateProfileDto = {
        username: updateData.username || currentProfile.profile.username,
        firstName: updateData.firstName || currentProfile.profile.firstName,
        lastName: updateData.lastName || currentProfile.profile.lastName,
        address: updateData.address || currentProfile.profile.address,
        birthday: updateData.birthday || currentProfile.profile.birthday,
        phoneNumber: updateData.phoneNumber || currentProfile.profile.phoneNumber,
    }
    
    const userInfo = await UserModel
        .findByIdAndUpdate(user.id, { profile: newProfile })
        .select(['email', 'isVerified', 'profile'])

    if (!userInfo) {
        throw new Exception({ statusCode: 404, message: 'Profile not found!' })
    }

    return userInfo
}