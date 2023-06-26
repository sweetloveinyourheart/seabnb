import { NextFunction, Request, Response } from "express";
import * as AuthServices from '../services/auth.service'
import { DeviceInfoDto, LoginDto, RegisterDto } from "../dtos/auth.dto";
import { validate } from "class-validator";
import { Exception } from "../middlewares/globalExeception";

export async function login(request: Request, response: Response, next: NextFunction) {
    try {
        // Check for validation errors
        const deviceInfoDto = new DeviceInfoDto()
        deviceInfoDto.isBrowser = request.body.deviceInfo.isBrowser
        deviceInfoDto.isMobile = request.body.deviceInfo.isMobile
        deviceInfoDto.userAgent = request.body.deviceInfo.userAgent

        const deviceInfoErrors = await validate(deviceInfoDto);

        if (deviceInfoErrors.length) {
            throw new Exception({ statusCode: 400, validationErrors: deviceInfoErrors });
        }

        const loginDto = new LoginDto();
        loginDto.email = request.body.email;
        loginDto.password = request.body.password;
        loginDto.deviceInfo = deviceInfoDto

        const errors = await validate(loginDto);

        if (errors.length) {
            throw new Exception({ statusCode: 400, validationErrors: errors });
        }

        const token = await AuthServices.login(loginDto)

        return response.status(200).json(token)
    } catch (error) {
        next(error)
    }
}

export async function register(request: Request, response: Response, next: NextFunction) {
    try {
        // Check for validation errors
        const registerDto = new RegisterDto();
        registerDto.email = request.body.email;
        registerDto.password = request.body.password;
        registerDto.firstName = request.body.firstName;
        registerDto.lastName = request.body.lastName;

        const errors = await validate(registerDto);

        if (errors.length) {
            throw new Exception({ statusCode: 400, validationErrors: errors });
        }

        const deviceInfoDto = new DeviceInfoDto()
        deviceInfoDto.isBrowser = request.body.deviceInfo.isBrowser
        deviceInfoDto.isMobile = request.body.deviceInfo.isMobile
        deviceInfoDto.userAgent = request.body.deviceInfo.userAgent

        const deviceInfoErrors = await validate(deviceInfoDto);

        if (deviceInfoErrors.length) {
            throw new Exception({ statusCode: 400, validationErrors: deviceInfoErrors });
        }

        // Register new account
        const msg = await AuthServices.register(registerDto)

        return response.status(201).json(msg)
    } catch (error) {
        return next(error)
    }
}

export async function verifyAccount(request: Request, response: Response, next: NextFunction) {
    try {
        if (!request.user) {
            throw new Exception({ statusCode: 401, message: 'Unauthorized' })
        }

        const code = request.query.code as string
        if (!code) {
            throw new Exception({ statusCode: 400, message: 'Code is not valid' });
        }

        const result = await AuthServices.verifyAccount(request.user, code)

        return response.status(201).json(result)
    } catch (error) {
        return next(error)
    }
}

export async function logout(request: Request, response: Response, next: NextFunction) {
    try {
        if (!request.user) {
            throw new Exception({ statusCode: 401, message: 'Unauthorized' })
        }

        const token = request.query.token as string
        if (!token) {
            throw new Exception({ statusCode: 400, message: 'Refresh token cannot be empty' });
        }

        const result = await AuthServices.logout(request.user, token)

        return response.status(201).json(result)
    } catch (error) {
        return next(error)
    }
}

export async function getLoggedInDevices(request: Request, response: Response, next: NextFunction) {
    try {
        if (!request.user) {
            throw new Exception({ statusCode: 401, message: 'Unauthorized' })
        }

        const result = await AuthServices.getLoggedInDevices(request.user)

        return response.status(200).json(result)
    } catch (error) {
        return next(error)
    }
}

export async function refreshToken(request: Request, response: Response, next: NextFunction) {
    try {
        const token = request.query.token as string
        const result = await AuthServices.refreshToken(token)

        return response.status(200).json(result)
    } catch (error) {
        return next(error)
    }
}