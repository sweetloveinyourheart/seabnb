import { IDeviceInfo } from "../models/security.model";

export interface LoggedInDevices {
    deviceInfo: IDeviceInfo
    loggedAt: Date
}