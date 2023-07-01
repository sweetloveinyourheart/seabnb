import { BASE_URL } from "@/common/configs/base-url"
import { Response } from "@/common/types/response"
import axios from "axios"

interface IProfile {
    username: string
    firstName: string
    lastName: string
    birthday?: string
    phoneNumber?: string
    address?: string
}

export interface IUserInfo {
    email: string
    isVerified: boolean
    profile: IProfile
}

export const getUserInfo = async (): Promise<Response<IUserInfo>> => {
    try {
        const { data } = await axios.get(`${BASE_URL}/user/user-info`)
        return { data, error: null }
    } catch (error: any) {
        return { data: null, error: error.response?.data?.message || `An error occurred: ${error.message}` }
    }
}