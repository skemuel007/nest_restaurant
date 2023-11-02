import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";

export class LoginDto {

    @IsNotEmpty()
    @IsString()
    @IsEmail({}, { message: 'Please enter a valid email address' })
    readonly email: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(5, { message: 'Minimum character length cannot be less than 5' })
    readonly password: string;
}