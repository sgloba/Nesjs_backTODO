import {IsArray, IsOptional} from 'class-validator';
import {MarksI} from "../../article/interfaces/marks.interface";


export class UpdateCommentDto {
    @IsArray()
    @IsOptional()
    readonly title: [];

    @IsArray()
    @IsOptional()
    readonly body: [];

    @IsArray()
    @IsOptional()
    readonly tags: [string];

    @IsArray()
    @IsOptional()
    readonly marks: MarksI
}
