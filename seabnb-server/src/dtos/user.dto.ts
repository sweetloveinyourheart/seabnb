import { IsDateString, IsPhoneNumber, IsString, Min } from "class-validator";
import { IProfile } from "../models/user.model";

export class UpdateProfileDto implements Partial<IProfile> {
    @IsString()
    username?: string;

    @IsString()
    firstName?: string;

    @IsString()
    lastName?: string;

    @IsString()
    address?: string;

    @IsString()
    @IsDateString()
    birthday?: string

    @IsString()
    @IsPhoneNumber('VI')
    phoneNumber?: string
}