import {IsNotEmpty, IsNumber, IsString, IsUrl} from 'class-validator';
export class ProductDto {

    @IsString()
    @IsNotEmpty()
    readonly name: string;

    @IsNumber()
    @IsNotEmpty()
    readonly price: number;

    @IsString()
    @IsNotEmpty()
    readonly type: string;

}