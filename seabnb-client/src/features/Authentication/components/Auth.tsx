"use client"

import { Button, Modal, Typography } from "antd";
import { CloseOutlined } from '@ant-design/icons'
import { FunctionComponent, useState } from "react";
import styles from '../styles/Auth.module.scss'
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { closeAuthModal } from "@/redux/slices/authSlice";
import Login from "./Login";
import Register from "./Register";

interface AuthenticationProps { }

const Authentication: FunctionComponent<AuthenticationProps> = () => {

    const { isAuthModalOpen, modalMode } = useAppSelector(state => state.auth)
    const dispatch = useAppDispatch()

    const handleCancel = () => {
        dispatch(closeAuthModal())
    };

    return (
        <Modal
            open={isAuthModalOpen}
            onCancel={handleCancel}
            closable={false}
            centered
            title={(
                <div className={styles["authentication-title"]}>
                    <div style={{ width: 16 }}></div>
                    <h4>LOGIN OR SIGNUP</h4>
                    <div><CloseOutlined style={{ cursor: 'pointer' }} onClick={handleCancel}/></div>
                </div>
            )}
            footer={null}
        >
            <div className={styles["auth-wrapper"]}>
                <Typography.Title level={3}>Welcome to Seabnb</Typography.Title>
                {modalMode === "login"
                    ? <Login />
                    : <Register />
                }
            </div>
        </Modal>
    );
}

export default Authentication;