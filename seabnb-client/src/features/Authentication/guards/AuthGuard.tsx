"use client"

import PageLoading from "@/components/PageLoading/PageLoading";
import { useAppSelector } from "@/redux/hooks";
import { useRouter } from "next/navigation";
import { FunctionComponent, useEffect } from "react";

interface AuthGuardProps {
    children: any
}

const AuthGuard: FunctionComponent<AuthGuardProps> = ({ children }) => {
    const { user, loading } = useAppSelector(state => state.auth)

    const router = useRouter()

    useEffect(() => {
        if (!user && !loading) {
            router.push('/')
        }
    }, [user, loading])

    if (loading || !user) return <PageLoading />

    return children;
}

export default AuthGuard;