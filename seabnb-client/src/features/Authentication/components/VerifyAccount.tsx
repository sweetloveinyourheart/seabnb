"use client"

import { FunctionComponent, useEffect, useState } from "react";
import styles from '../styles/VerifyAccount.module.scss'
import AuthCode from 'react-auth-code-input';
import { Button, Result, message } from "antd";
import { useRouter } from "next/navigation";
import { resendValidationCode, verifyAccount } from "../services/auth.service";

interface VerifyAccountProps { }

const VerifyAccount: FunctionComponent<VerifyAccountProps> = () => {
    const [code, setCode] = useState<string>('');
    const [remainingSecond, setRemainingSecond] = useState<number>(120)

    const [verifying, setVerifying] = useState(false)
    const [verifyResult, setVerifyResult] = useState<'success' | 'error' | null>(null)

    const router = useRouter()

    const handleOnChange = async (res: string) => {
        setCode(res);
        if (res.length === 6) {
            setVerifying(true)
            
            // send verify request
            const response = await verifyAccount(res)
            if(response.error) {
                message.error(response.error)
            } else {
                message.success("Your email has been verified !")
                router.push("/account-settings")
            }

            setVerifying(false)
        }
    };

    const onReSendCode = async () => {
        setRemainingSecond(120)

        // resend logic
        const response = await resendValidationCode()
        if(!response.error) {
            message.error('Resend validation code failed, please try again !')
            setRemainingSecond(0)
            return;
        }

        const interval = setInterval(() => {
            setRemainingSecond(s => {
                if (s <= 0) { clearInterval(interval) }

                return s - 1
            })
        }, 1000)
    }

    useEffect(() => {
        const interval = setInterval(() => {
            setRemainingSecond(s => {
                if (s <= 0) { clearInterval(interval) }

                return s - 1
            })
        }, 1000)

        return () => clearInterval(interval)
    }, [])

    return (
        verifyResult === null
            ? (
                <div className={styles["verify-account"]}>
                    <h1>Verify your account</h1>
                    <AuthCode
                        onChange={handleOnChange}
                        allowedCharacters="numeric"
                        containerClassName={styles["auth-code-box"]}
                        disabled={verifying}
                    />
                    <p>A message with a verification code has been sent to your email. Enter the code to continue</p>
                    <div className={styles["resend-btn"]}>
                        <Button
                            type="primary"
                            disabled={remainingSecond >= 0 || verifying}
                            onClick={onReSendCode}
                            loading={verifying}
                        >
                            {verifying ? "Verifying" :"Resend code"} {remainingSecond > 0 ? `(${remainingSecond})` : ""}
                        </Button>
                    </div>
                </div>
            )
            : verifyResult === 'success'
                ? (
                    <Result
                        status="success"
                        title="Successfully Verified Email!"
                        subTitle="Now you can go to your profile to setup more personal information"
                        extra={[
                            <Button type="primary" key="console" onClick={() => router.push('/profile')}>
                                Your profile
                            </Button>
                        ]}
                    />
                )
                : (
                    <Result
                        status="error"
                        title="An error occurred, you can try again later!"
                        extra={[
                            <Button key="buy" onClick={() => setVerifyResult(null)}>Try Again</Button>,
                        ]}
                    />
                )

    );
}

export default VerifyAccount;