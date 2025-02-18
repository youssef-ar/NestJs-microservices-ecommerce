import { IsNumber, IsOptional, IsString } from "class-validator";

export class EditProductDto {
    @IsString()
    @IsOptional()
    name?: string;
    
    @IsString()
    @IsOptional()
    description?: string;
    
    @IsNumber()
    @IsOptional()
    price?: number;
    
    @IsString()
    @IsOptional()
    categoryId?: number;
    
    @IsString()
    @IsOptional()
    image?: string;
    
    @IsString()
    @IsOptional()
    brand?: string;
}