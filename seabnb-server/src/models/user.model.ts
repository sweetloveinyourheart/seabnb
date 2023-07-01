import { Schema, model } from 'mongoose';

enum UserRoles {
    User = "user"
}

export interface IProfile {
    username: string
    firstName: string
    lastName: string
    birthday?: string
    phoneNumber?: string
    address?: string
}

export interface IUser {
    email: string
    password: string
    role: UserRoles
    isVerified: boolean
    profile: IProfile
}

const ProfileSchema = new Schema<IProfile>({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    birthday: { type: String },
    phoneNumber: { type: String },
    address: { type: String }
}, { _id: false })

const UserSchema = new Schema<IUser>({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        default: UserRoles.User
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    profile: ProfileSchema
})

const UserModel = model('users', UserSchema)
export default UserModel