"use client"

import { Breadcrumb, Button, Col, Row, message } from "antd";
import { HomeOutlined, UserOutlined } from '@ant-design/icons';
import { FunctionComponent, useState } from "react";
import styles from '../styles/PersonalInfo.module.scss'
import { IProfile } from "@/features/Authentication/services/user-info.service";
import { useAppSelector } from "@/redux/hooks";
import { updateProfile } from "../services/personal-info.service";

interface PersonalInfoProps { }
interface InfoEditorProps {
    title: string
    field: keyof IProfile
    value: string | undefined
}

const InfoEditor: FunctionComponent<InfoEditorProps> = ({ title, field, value }) => {
    const [isEditing, setEditing] = useState(false)
    const [info, setInfo] = useState('')

    const onSave = async () => {
        const updateDto = {
            [field]: info
        }

        const { data, error } = await updateProfile(updateDto)
        if (error) {
            message.error(error)
        } else if (data) {
            message.success("Update information successfully !")
            setEditing(false)
        }
    }

    return (
        <>
            {isEditing
                ? (
                    <div className={styles['info-editor']}>
                        <Row>
                            <Col lg={22}>
                                <div className={styles["row-left"]}>
                                    <h5>{title}</h5>
                                    <p>Current <span>{title}</span>: {value || "Not provided"}</p>
                                </div>
                            </Col>
                            <Col lg={2}>
                                <div className={styles['row-right']}>
                                    <Button type="link" onClick={() => setEditing(s => !s)}>Cancel</Button>
                                </div>
                            </Col>
                            <div className={styles["editor"]}>
                                <input
                                    placeholder={`Enter Your ${title}`}
                                    value={info}
                                    onChange={e => setInfo(e.target.value)}
                                />
                                <Button type="primary" onClick={onSave}>Save</Button>
                            </div>
                        </Row>
                    </div>
                )
                : (
                    <div className={styles['info-editor']}>
                        <Row>
                            <Col lg={22}>
                                <div className={styles["row-left"]}>
                                    <h5>{title}</h5>
                                    <p>{value || "Not provided"}</p>
                                </div>
                            </Col>
                            <Col lg={2}>
                                <div className={styles['row-right']}>
                                    <Button type="link" onClick={() => setEditing(s => !s)}>Edit</Button>
                                </div>
                            </Col>
                        </Row>
                    </div>
                )
            }
        </>
    )
}

const PersonalInfo: FunctionComponent<PersonalInfoProps> = () => {

    const { user } = useAppSelector(state => state.auth)

    return (
        <div className={styles["personal-info"]}>
            <Breadcrumb
                items={[
                    {
                        href: '/',
                        title: <HomeOutlined />,
                    },
                    {
                        href: '/account-settings',
                        title: (
                            <>
                                <UserOutlined />
                                <span>Settings</span>
                            </>
                        ),
                    },
                    {
                        title: 'Personal info',
                    },
                ]}
            />
            <h1>Personal info</h1>
            {user
                ? (
                    <Row>
                        <Col lg={16}>
                            <InfoEditor
                                title="Username" field="username"
                                value={user.profile.username}
                            />
                            <InfoEditor
                                title="First Name" field="firstName"
                                value={user.profile.firstName}
                            />
                            <InfoEditor
                                title="Last Name" field="lastName"
                                value={user.profile.lastName}
                            />
                            <InfoEditor
                                title="Phone Number" field="phoneNumber"
                                value={user.profile.phoneNumber}
                            />
                            <InfoEditor
                                title="Address" field="address"
                                value={user.profile.address}
                            />
                            <InfoEditor
                                title="Birthday" field="birthday"
                                value={user.profile.birthday}
                            />
                        </Col>
                    </Row>
                )
                : null
            }
        </div>
    );
}

export default PersonalInfo;