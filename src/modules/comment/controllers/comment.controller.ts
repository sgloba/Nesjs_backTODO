import {Body, Controller, Get, Post, Query} from '@nestjs/common';
import {CommentService} from "../services/comment.service";
import {User} from "../../article/decorators/user.decorator";
import {CreateCommentDto} from "../dto/comment-create.dto";

@Controller('api/comments')
export class CommentController {
    constructor(
        private commentService: CommentService
    ) {
    }

    @Get()
    getByArticle(@Query() {article_id}) {
        return this.commentService.getByArticle(article_id)
    }

    @Post()
    async create(
        @Body() dto: CreateCommentDto,
        @User('user_id') userId
    ) {

        const author = { uid: userId}
        const body = {...dto}

        return await this.commentService.create(body, author);

    }
}
