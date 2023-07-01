import axios from "axios";

export function setDefaultAuthHeader(accessToken: string) {
    axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`
}