import { BASE_URL } from '@/common/configs/base-url'
import { Response } from '@/common/types/response'
import axios from 'axios'

interface Tokens {
    accessToken: string
    refreshToken: string
}

interface DeviceInfoDto {
    isMobile: true,
    isBrowser: false,
    userAgent: any
}

export interface SignInDto {
    email: string
    password: string
    deviceInfo: DeviceInfoDto
}

export interface SignUpDto {
    email: string
    password: string
    firstName: string
    lastName: string
    deviceInfo: DeviceInfoDto
}

export const signIn = async (body: SignInDto): Promise<Response<Tokens>> => {
    try {
        const { data } = await axios.post<Tokens>(`${BASE_URL}/auth/sign-in`, body)
        return { data, error: null }
    } catch (error: any) {
        return { data: null, error: error.response?.data?.message || `An error occurred: ${error.message}` }
    }
}

export const signUp = async (body: SignUpDto): Promise<Response<Tokens>> => {
    try {
        const { data } = await axios.post<Tokens>(`${BASE_URL}/auth/sign-up`, body)
        return { data, error: null }

    } catch (error: any) {
        return { data: null, error: error.response?.data?.message || `An error occurred: ${error.message}` }
    }
}

export const verifyAccount = async (code: string): Promise<Response<{ message: string }>> => {
    try {
        const { data } = await axios.post(`${BASE_URL}/auth/verify-account?code=${code}`)
        return { data, error: null }

    } catch (error: any) {
        return { data: null, error: error.response?.data?.message || `An error occurred: ${error.message}` }
    }
}

export const resendValidationCode = async (): Promise<Response<{ message: string }>> => {
    try {
        const { data } = await axios.post(`${BASE_URL}/auth/resend-validation-code`)
        return { data, error: null }

    } catch (error: any) {
        return { data: null, error: error.response?.data?.message || `An error occurred: ${error.message}` }
    }
}

export const refreshNewToken = async (token: string): Promise<Response<{ accessToken: string }>> => {
    try {
        const { data } = await axios.get(`${BASE_URL}/auth/refresh-token?token=${token}`)
        return { data, error: null }
    } catch (error: any) {
        return { data: null, error: error.response?.data?.message || `An error occurred: ${error.message}` }
    }
}