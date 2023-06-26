import { LoginDto, RegisterDto } from '../dtos/auth.dto'
import UserModel from '../models/user.model'
import jwt from 'jsonwebtoken'
import { comparePassword, hashPassword } from '../utils/password'
import { sendMail } from '../utils/mailer'
import { generateUsername, generateValidationCode } from '../utils/generator'
import { checkValidationCode, storeValidationCode } from '../utils/cache'
import { Exception } from '../middlewares/globalExeception'
import { AccessToken, Tokens } from '../responses/tokens.response'
import { IRequestUser } from '../middlewares/jwtAuthGuard'
import { Message } from '../responses/message.response'
import SecurityModel from '../models/security.model'
import { LoggedInDevices } from '../responses/devices.response'

const JWT_SECRET = process.env.JWT_SECRET as string

export async function getLoggedInDevices(user: IRequestUser): Promise<LoggedInDevices[]> {
    const securityData = await SecurityModel.find({ userId: user.id })
    if (!securityData) {
        return []
    }

    const devices = securityData.map((security) => ({
        deviceInfo: security.deviceInfo,
        loggedAt: security.loggedAt
    }))

    return devices
}

export async function register(account: RegisterDto): Promise<Tokens> {
    const isExist = await UserModel.findOne({ email: account.email })
    if (isExist) {
        throw new Exception({ message: 'Email is already exist', statusCode: 400 })
    }

    const hashedPassword = await hashPassword(account.password)
    const username = generateUsername()

    // Send validation code to email
    const validationCode = generateValidationCode()
    const mail = {
        subject: 'Validate your Protato account',
        content: `Your validation code is ${validationCode}`
    }

    await sendMail(account.email, mail)
    await storeValidationCode(account.email, validationCode)

    // Create and save new account
    const newAccount = await UserModel.create({
        email: account.email,
        password: hashedPassword,
        profile: {
            firstName: account.firstName,
            lastName: account.lastName,
            username
        }
    })

    await newAccount.save()

    // generate access token
    const payload = {
        sub: newAccount.id,
        email: newAccount.email
    }

    const accessToken = jwt.sign(payload, JWT_SECRET, { expiresIn: '5m' })
    const refreshToken = jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' })

    // Store refresh token
    const newLoginSession = await SecurityModel.create({
        userId: newAccount._id,
        refreshToken,
        deviceInfo: account.deviceInfo,
        loggedAt: new Date()
    })
    await newLoginSession.save()

    return { accessToken, refreshToken }
}

export async function login(user: LoginDto): Promise<Tokens> {
    const account = await UserModel.findOne({ email: user.email })
    if (!account) {
        throw new Exception({ message: 'Username or password is not valid', statusCode: 400 })
    }

    if (!account.isVerified) {
        throw new Exception({ message: 'This account is not verified yet!', statusCode: 401 })
    }

    const isValidPass = await comparePassword(user.password, account.password)
    if (!isValidPass) {
        throw new Exception({ message: 'Username or password is not valid', statusCode: 401 })
    }

    // generate access token
    const payload = {
        sub: account.id,
        email: account.email
    }

    const accessToken = jwt.sign(payload, JWT_SECRET, { expiresIn: '5m' })
    const refreshToken = jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' })

    // Store refresh token
    const newLoginSession = await SecurityModel.create({
        userId: account._id,
        refreshToken,
        deviceInfo: user.deviceInfo,
        loggedAt: new Date()
    })
    await newLoginSession.save()

    return { accessToken, refreshToken }
}

export async function verifyAccount(user: IRequestUser, code: string): Promise<Message> {
    const account = await UserModel.findOne({ email: user.email })
    if (!account) {
        throw new Exception({ message: 'User not found', statusCode: 400 })
    }

    if (account.isVerified) {
        throw new Exception({ message: 'This account was verified!', statusCode: 400 })
    }

    const isValidCode = await checkValidationCode(user.email, code)
    if (!isValidCode) {
        throw new Exception({ message: 'Validation code not valid', statusCode: 403 })
    }

    await UserModel.findOneAndUpdate({ email: user.email }, { isVerified: true })

    return { message: 'Your account has been verified' }
}

export async function refreshToken(token: string): Promise<AccessToken> {
    const decoded: any | null = jwt.decode(token)
    if (!decoded) {
        throw new Exception({ message: 'Unauthorized', statusCode: 401 })
    }

    const payload = {
        sub: decoded.sub,
        email: decoded.email
    }

    const accessToken = jwt.sign(payload, JWT_SECRET, { expiresIn: '5m' })
    return { accessToken }
}

export async function logout(user: IRequestUser, refreshToken: string): Promise<Message> {
    const result = await SecurityModel.findOneAndDelete({ userId: user.id, refreshToken })
    if(!result) {
        throw new Exception({ message: 'Token is not valid', statusCode: 401 })
    }

    return { message: "User logout successfully !" }
}