import {IsNotEmpty, IsArray, IsOptional} from 'class-validator';
import {Mark} from "../schemas/mark.schema";
import {MarksI} from "../interfaces/marks.interface";


export class CreateArticleDto {
    @IsArray()
    @IsNotEmpty()
    readonly title: [];

    @IsArray()
    @IsNotEmpty()
    readonly body: [];

    @IsArray()
    @IsNotEmpty()
    readonly tags: [string];

    @IsOptional()
    readonly marks: Mark;
}
