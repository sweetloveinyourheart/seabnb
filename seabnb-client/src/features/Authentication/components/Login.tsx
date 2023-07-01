import { Alert, Button, Divider, Form, Input } from "antd";
import { FunctionComponent, useState } from "react";
import styles from '../styles/Login.module.scss'
import { useAppDispatch } from "@/redux/hooks";
import { openAuthModal, saveAccessToken } from "@/redux/slices/authSlice";
import { SignInDto, signIn } from "../services/auth.service";
import { isMobile, isBrowser } from 'react-device-detect'
import { saveRefreshToken } from "../utils/save-token";

interface LoginProps { }

const Login: FunctionComponent<LoginProps> = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState<boolean>(false)
    const [errors, setErrors] = useState<string[] | null>(null)

    const dispatch = useAppDispatch()
    const switchModalMode = () => dispatch(openAuthModal({ modalMode: 'register' }))

    const onFinishForm = async (values: any) => {
        setLoading(true)

        const loginDto: SignInDto = {
            ...values,
            deviceInfo: {
                isMobile,
                isBrowser,
                userAgent: navigator.userAgent
            }
        }
        const res = await signIn(loginDto)
        if (res.error) {
            if (typeof res.error === 'string') setErrors([res.error])
            if (typeof res.error === 'object') setErrors(res.error)
        } else if (res.data) {
            const { accessToken, refreshToken } = res.data

            dispatch(saveAccessToken({ accessToken }))
            saveRefreshToken(refreshToken)
        }

        setLoading(false)
    }

    return (
        <Form
            form={form}
            onFinish={onFinishForm}
            className={`${styles['login-form']} auth-custom`}
        >
            <div className={styles["form-wrapper"]}>
                <Form.Item
                    className={styles['form-item']}
                    name={"email"}
                >
                    <Input placeholder="Your email address" />
                </Form.Item>
                <Form.Item
                    className={styles['form-item']}
                    name={"password"}
                >
                    <Input.Password placeholder="Password" />
                </Form.Item>

            </div>
            <div className={styles['form-error']}>
                {errors
                    ? errors.map((err, index) => <Alert key={index} type="error" message={err} />)
                    : null
                }
            </div>
            <Form.Item style={{ margin: 0 }}>
                <Button
                    className={styles['continue-btn']}
                    type="primary"
                    htmlType="submit"
                    disabled={loading}
                >
                    Continue
                </Button>
            </Form.Item>
            <Divider>
                or
            </Divider>
            <p className={styles["switcher"]}>Not has an account yet ? <Button type="link" onClick={switchModalMode}>Create one</Button></p>
        </Form>
    );
}

export default Login;