import * as bcrypt from 'bcrypt'

export async function hashPassword(pass: string) {
    const salt = await bcrypt.genSalt(10)
    const hashed = await bcrypt.hash(pass, salt)
    return hashed
}

export async function comparePassword(pass:string, encrypted: string) {
    return await bcrypt.compare(pass, encrypted)
}