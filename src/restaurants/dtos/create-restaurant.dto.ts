import { IsEmail, IsEmpty, IsEnum, IsNotEmpty, IsPhoneNumber, IsString, isEnum } from "class-validator";
import { Category } from "../schemas/restaurant.schema";
import { User } from "../../auth/schemas/user.schema";

export class CreateRestaurantDto {
    @IsNotEmpty()
    @IsString()
    readonly name: string;

    @IsNotEmpty()
    @IsString()
    readonly description: string;

    @IsEmail({}, { message: 'Please enter a valid email address.' })
    @IsString()
    readonly email: string;

    @IsNotEmpty()
    @IsPhoneNumber('NG')
    readonly phoneNo: string;

    @IsNotEmpty()
    @IsString()
    readonly address: string;

    @IsNotEmpty()
    @IsEnum(Category, { message: 'Please enter the correct category' })
    readonly category: Category;

    @IsEmpty({ message: 'You cannot provide the user Id.' })
    readonly user: User;
}