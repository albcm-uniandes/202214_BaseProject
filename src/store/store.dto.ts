import { IsNotEmpty, IsNumber, IsString, IsUrl } from "class-validator";

export class StoreDto {
    @IsString()
    @IsNotEmpty()
    readonly name: string;

    @IsNumber()
    @IsNotEmpty()
    readonly city: number;

    @IsString()
    @IsNotEmpty()
    readonly address: string;
}
