"use client"

import { useAppSelector } from "@/redux/hooks";
import { FunctionComponent } from "react";
import styles from "../styles/AccountSetting.module.scss"
import { Col, Row } from "antd";
import { IdcardOutlined, SafetyOutlined } from '@ant-design/icons'
import { useRouter } from "next/navigation";

interface AccountSettingsProps { }

const settingItems = [
    { icon: <IdcardOutlined />, link: '/account-settings/personal-info', title: 'Personal Info', detail: "Provide personal details and how we can reach you" },
    { icon: <SafetyOutlined />, link: '/account-settings/login-and-security', title: 'Login & security', detail: "Update your password and secure your account" },
]

const AccountSettings: FunctionComponent<AccountSettingsProps> = () => {
    const { user } = useAppSelector(state => state.auth)

    const router = useRouter()

    return (
        <div className={styles["settings"]}>
            <div className={styles["user-info"]}>
                <h1>Account</h1>
                <p><span>{user?.profile.firstName} {user?.profile.lastName}</span> - {user?.email}</p>
            </div>
            <Row gutter={16}>
                {settingItems.map((setting, index) => (
                    <Col lg={8} key={index} onClick={() => router.push(setting.link)}>
                        <div className={styles["settings-tab"]}>
                            <div className={styles["tab-icon"]}>
                                {setting.icon}
                            </div>
                            <h5>{setting.title}</h5>
                            <p>{setting.detail}</p>
                        </div>
                    </Col>
                ))}
            </Row>
        </div>
    );
}

export default AccountSettings;