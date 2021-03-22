import {Body, Controller, Get, Param, Post, Put, Query} from '@nestjs/common';
import {CommentService} from "../services/comment.service";
import {User} from "../../article/decorators/user.decorator";
import {CreateCommentDto} from "../dto/comment-create.dto";
import {Article} from "../../article/schemas/article.schema";
import {UpdateCommentDto} from "../dto/comment-update.dto";
import {CommonService} from "../../../services/common.service";
import {MarksService} from "../../marks/services/marks.service";

@Controller('api/comments')
export class CommentController {
    constructor(
        private commentService: CommentService,
        private marksService: MarksService,
        private commonService: CommonService
    ) {
    }

    @Get()
    getByArticle(
        @Query() {article_id},
        @Query() {page},
        @Query() {parent_comment_id},
        @Query() {commentId},
        @User('user_id') userId
    ) {
        if(commentId) {
            return this.commentService.getCommentById(commentId, userId)
        }
        return this.commentService.getByArticle(article_id, userId, page, parent_comment_id)
    }

    @Post()
    async create(
        @Body() dto: CreateCommentDto,
        @User('user_id') userId
    ) {
        const author = { uid: userId}
        const body = {...dto}

        return await this.commentService.create(body, author)
            .then((item) => this.commonService.populateUser(item))
            .then((item) => this.commonService.populateMarks(item, userId))
            .then((item)=>this.commentService.populateReplies(item))
    }

    @Put(':id')
    update(@Param('id') id, @Body() dto: UpdateCommentDto): Promise<void> {
        return this.marksService.setMark(id, dto);
    }
}
