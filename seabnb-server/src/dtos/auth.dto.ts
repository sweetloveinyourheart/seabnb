import { IsBoolean, IsEmail, IsNotEmpty, IsString, IsStrongPassword, ValidateNested } from "class-validator"

export class RegisterDto {
    @IsEmail()
    email!: string

    @IsStrongPassword()
    password!: string

    @IsString()
    firstName!: string

    @IsString()
    lastName!: string

    @IsNotEmpty()
    @ValidateNested()
    deviceInfo!: DeviceInfoDto
}

export class DeviceInfoDto {
    @IsBoolean()
    isMobile!: boolean

    @IsBoolean()
    isBrowser!: boolean

    @IsString()
    userAgent!: string
}

export class LoginDto {
    @IsNotEmpty()
    email!: string

    @IsNotEmpty()
    password!: string

    @IsNotEmpty()
    @ValidateNested()
    deviceInfo!: DeviceInfoDto
}