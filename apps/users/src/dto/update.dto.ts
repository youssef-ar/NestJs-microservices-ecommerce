import { IsEmail, IsNotEmpty, IsOptional, IsString, Matches, MinLength, } from 'class-validator';
export class UpdateDto {
    @IsEmail()
    @IsOptional()
    email?: string;

    @IsOptional()
    @IsString()
    @MinLength(8, { message: 'Password must be at least 8 characters long' })
    @Matches(/[A-Z]/, { message: 'Password must contain at least one uppercase letter' })
    @Matches(/[!@#$%^&*(),.?":{}|<>]/, { message: 'Password must contain at least one special character' })
    password?: string;

    @IsOptional()
    firstName?: string;

    @IsOptional()
    lastName?: string;
}


