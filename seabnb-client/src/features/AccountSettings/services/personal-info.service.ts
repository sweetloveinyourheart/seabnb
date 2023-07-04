import { BASE_URL } from "@/common/configs/base-url"
import { Response } from "@/common/types/response"
import { IProfile, IUserInfo } from "@/features/Authentication/services/user-info.service"
import axios from "axios"

export interface UpdateProfileDto extends Partial<IProfile> {}

export const updateProfile = async (updateDto: UpdateProfileDto): Promise<Response<IUserInfo>> => {
    try {
        const { data } = await axios.put(`${BASE_URL}/user/update-profile`, updateDto)
        return { data, error: null }
    } catch (error: any) {
        return { data: null, error: error.response?.data?.message || `An error occurred: ${error.message}` }
    }
}