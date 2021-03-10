import {IsNotEmpty, IsArray, IsOptional} from 'class-validator';
import {Mark} from "../schemas/mark.schema";
import {MarksI} from "../interfaces/marks.interface";
import {Transform} from "class-transformer";


export class CreateArticleDto {
    @Transform(({ value }) => JSON.parse(value))
    @IsArray()
    @IsNotEmpty()
    readonly title: [];

    @Transform(({ value }) => JSON.parse(value))
    @IsArray()
    @IsNotEmpty()
    readonly body: [];

    @Transform(({ value }) => JSON.parse(value))
    @IsArray()
    @IsNotEmpty()
    @IsOptional()
    readonly tags: [string];

    @IsOptional()
    readonly marks: Mark;

    @IsOptional()
    readonly fileImg: File[];

    @IsOptional()
    readonly img: string;
}
