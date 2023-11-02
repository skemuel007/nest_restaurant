import { IsEmail, IsEmpty, IsEnum, IsNotEmpty, IsOptional, IsPhoneNumber, IsString } from "class-validator";
import { Category } from "../schemas/restaurant.schema";
import { User } from "../../auth/schemas/user.schema";

export class UpdateRestaurantDto {
    @IsOptional()
    @IsString()
    readonly name: string;

    @IsOptional()
    @IsString()
    readonly description: string;

    @IsEmail({}, { message: 'Please enter a valid email address.' })
    @IsString()
    @IsOptional()
    readonly email: string;

    @IsOptional()
    @IsPhoneNumber('NG')
    readonly phoneNo: string;

    @IsOptional()
    @IsString()
    readonly address: string;

    @IsOptional()
    @IsString()
    @IsEnum(Category, { message: 'Please enter the correct category' })
    readonly category: Category

    @IsEmpty({ message: 'You cannot provide the user Id.' })
    readonly user: User;
}