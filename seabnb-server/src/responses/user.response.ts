import { IProfile } from "../models/user.model"

export interface UserInfo {
    email: string
    isVerified: boolean
    profile: IProfile
}