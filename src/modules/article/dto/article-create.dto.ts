import {IsNotEmpty, IsArray} from 'class-validator';


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
}
