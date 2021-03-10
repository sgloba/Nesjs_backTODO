import {IsNotEmpty, IsOptional} from 'class-validator';


export class CreateCommentDto {

    @IsNotEmpty()
    readonly body: string;

    @IsNotEmpty()
    readonly article_id: string;

    @IsOptional()
    readonly parent_comment_id: string;

    @IsNotEmpty()
    timestamp: string;
}
