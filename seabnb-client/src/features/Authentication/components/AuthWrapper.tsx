"use client"

import { FunctionComponent, useEffect } from "react";
import Authentication from "./Auth";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { getRefreshToken } from "../utils/save-token";
import { refreshNewToken } from "../services/auth.service";
import { clearAuthState, saveAccessToken, saveUser, setLoading } from "@/redux/slices/authSlice";
import { setDefaultAuthHeader } from "@/common/configs/axios";
import { getUserInfo } from "../services/user-info.service";

interface AuthWrapperProps {
    children: any
}

const AuthWrapper: FunctionComponent<AuthWrapperProps> = ({ children }) => {
    const { accessToken } = useAppSelector(state => state.auth)

    const dispatch = useAppDispatch()

    const refreshToken = async () => {
        const refreshToken = getRefreshToken()
        if (refreshToken) {
            const { data } = await refreshNewToken(refreshToken)

            if (data) {
                dispatch(saveAccessToken({ accessToken: data.accessToken }))
            } else {
                dispatch(clearAuthState())
                dispatch(setLoading(false))
            }
        }
    }

    useEffect(() => {
        const interval = setInterval(() => { refreshToken() }, 5 * 60 * 1000) // fetch new token every 5 minutes
        refreshToken() // fetch token on the first time 

        return () => clearInterval(interval)
    }, [])

    useEffect(() => {
        if (accessToken) {
            // fetch user data
            (async () => {
                setDefaultAuthHeader(accessToken)

                const res = await getUserInfo()
                dispatch(saveUser({ user: res.data }))
                dispatch(setLoading(false))

            })()
        }
    }, [accessToken])

    return (
        <>
            {children}
            <Authentication />
        </>
    );
}

export default AuthWrapper;