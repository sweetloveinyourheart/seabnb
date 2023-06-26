import { Schema, model } from 'mongoose';

export interface IDeviceInfo {
    isMobile: boolean,
    isBrowser: boolean,
    userAgent: string,
}

export interface ISecurity {
    userId: string
    refreshToken: string
    deviceInfo: IDeviceInfo
    loggedAt: Date
}

const DeviceInfo = new Schema<IDeviceInfo>({
    isBrowser: {
        type: Boolean,
        required: true
    },
    isMobile: {
        type: Boolean,
        required: true
    },
    userAgent: {
        type: String,
        required: true
    }
})

const SecuritySchema = new Schema<ISecurity>({
    userId: {
        type: String,
        required: true
    },
    refreshToken: {
        type: String,
        required: true
    },
    deviceInfo: DeviceInfo,
    loggedAt: {
        type: Date,
        default: new Date()
    }
})

const SecurityModel = model('security', SecuritySchema)
export default SecurityModel