export function generateUsername() {
    let str = 'user' + String(Math.floor(100000 + Math.random() * 900000))
    return str
}

export function generateValidationCode() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}