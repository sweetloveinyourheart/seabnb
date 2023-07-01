import jscookie from 'js-cookie'

export function saveRefreshToken(token: string) {
    jscookie.set('refresh_token', token)
}

export function removeRefreshToken() {
    jscookie.remove('refresh_token')
}

export function getRefreshToken() {
    return jscookie.get('refresh_token')
}