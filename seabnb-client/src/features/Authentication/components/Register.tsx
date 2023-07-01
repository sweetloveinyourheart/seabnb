import { Alert, Button, Divider, Form, Input } from "antd";
import { FunctionComponent, useState } from "react";
import styles from '../styles/Login.module.scss'
import { useAppDispatch } from "@/redux/hooks";
import { openAuthModal, saveAccessToken } from "@/redux/slices/authSlice";
import { isMobile, isBrowser } from 'react-device-detect'
import { SignUpDto, signUp } from "../services/auth.service";
import { saveRefreshToken } from "../utils/save-token";
import { useRouter } from "next/navigation";

interface RegisterProps { }

const Register: FunctionComponent<RegisterProps> = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState<boolean>(false)
    const [errors, setErrors] = useState<string[] | null>(null)

    const dispatch = useAppDispatch()
    const router = useRouter()

    const switchModalMode = () => dispatch(openAuthModal({ modalMode: 'login' }))

    const onFinishForm = async (values: any) => {
        setLoading(true)

        const { retypePassword, ...data } = values
        if (retypePassword !== data.password) {
            setErrors(['Password does not match !'])
            return;
        }

        const signupDto: SignUpDto = {
            ...data,
            deviceInfo: {
                isMobile,
                isBrowser,
                userAgent: navigator.userAgent
            }
        }
        const res = await signUp(signupDto)
        if (res.error) {
            if (typeof res.error === 'string') setErrors([res.error])
            if (typeof res.error === 'object') setErrors(res.error)
        } else if (res.data) {
            const { accessToken, refreshToken } = res.data

            dispatch(saveAccessToken({ accessToken }))
            saveRefreshToken(refreshToken)
            router.push('/verify-account')
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
                    rules={[
                        {
                            required: true,
                            message: "Please input your email"
                        },
                        {
                            type: 'email',
                            message: 'The input is not valid E-mail!',
                        },
                    ]}
                >
                    <Input placeholder="Your email address" />
                </Form.Item>
                <Form.Item
                    className={styles['form-item']}
                    name={"password"}
                    rules={[
                        {
                            required: true,
                            message: "Please confirm your password"
                        },
                        {
                            min: 6,
                            message: "Password must have at least 6 character"
                        },
                        {
                            message: 'Password must have at least one uppercase letter',
                            validator: (_, value) => {
                                if (/[A-Z]/.test(value)) {
                                    return Promise.resolve();
                                } else {
                                    return Promise.reject()
                                }
                            }
                        },
                        {
                            message: 'Password must have at least one lowercase letter',
                            validator: (_, value) => {
                                if (/[a-z]/.test(value)) {
                                    return Promise.resolve();
                                } else {
                                    return Promise.reject()
                                }
                            }
                        },
                        {
                            message: 'Password must have at least one special letter',
                            validator: (_, value) => {
                                if (/[!@#$&*~%^?"']/.test(value)) {
                                    return Promise.resolve();
                                } else {
                                    return Promise.reject()
                                }
                            }
                        },
                        {
                            message: 'Password must have at least one number character',
                            validator: (_, value) => {
                                if (/[0-9]/.test(value)) {
                                    return Promise.resolve();
                                } else {
                                    return Promise.reject()
                                }
                            }
                        }
                    ]}
                >
                    <Input.Password placeholder="Password" />
                </Form.Item>
                <Form.Item
                    className={styles['form-item']}
                    name={"retypePassword"}
                    rules={[
                        {
                            required: true,
                            message: "Please confirm your password"
                        },
                        {
                            min: 6,
                            message: "Password must have at least 6 character"
                        },
                        {
                            message: 'Password must have at least one uppercase letter',
                            validator: (_, value) => {
                                if (/[A-Z]/.test(value)) {
                                    return Promise.resolve();
                                } else {
                                    return Promise.reject()
                                }
                            }
                        },
                        {
                            message: 'Password must have at least one lowercase letter',
                            validator: (_, value) => {
                                if (/[a-z]/.test(value)) {
                                    return Promise.resolve();
                                } else {
                                    return Promise.reject()
                                }
                            }
                        },
                        {
                            message: 'Password must have at least one special letter',
                            validator: (_, value) => {
                                if (/[!@#$&*~%^?"']/.test(value)) {
                                    return Promise.resolve();
                                } else {
                                    return Promise.reject()
                                }
                            }
                        },
                        {
                            message: 'Password must have at least one number character',
                            validator: (_, value) => {
                                if (/[0-9]/.test(value)) {
                                    return Promise.resolve();
                                } else {
                                    return Promise.reject()
                                }
                            }
                        }
                    ]}
                >
                    <Input.Password placeholder="Retype password" />
                </Form.Item>
                <Form.Item
                    className={styles['form-item']}
                    name={"firstName"}
                    rules={[
                        {
                            required: true,
                            message: "Please confirm your password"
                        }
                    ]}
                >
                    <Input placeholder="First name" />
                </Form.Item>
                <Form.Item
                    className={styles['form-item']}
                    name={"lastName"}
                    rules={[
                        {
                            required: true,
                            message: "Please confirm your password"
                        }
                    ]}
                >
                    <Input placeholder="Last name" />
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
                    className={`${styles['continue-btn']} ${loading ? styles['continue-btn--disabled'] : ''}`}
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
            <p className={styles["switcher"]}>Already has an account ? <Button type="link" onClick={switchModalMode}>Login</Button></p>
        </Form>
    );
}

export default Register;