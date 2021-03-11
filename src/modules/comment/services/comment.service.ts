import { Injectable } from '@nestjs/common';
import {InjectModel} from "@nestjs/mongoose";
import {Model} from "mongoose";
import {Mark, MarkDocument} from "../../marks/schemas/mark.schema";
import {Comment, CommentDocument} from "../schemas/comment.schema";
import {CreateCommentDto} from "../dto/comment-create.dto";
import {CommonService} from "../../../services/common.service";

@Injectable()
export class CommentService {
    constructor(
        @InjectModel(Comment.name)
        private commentModel: Model<CommentDocument>,
        @InjectModel(Mark.name)
        private markModel: Model<MarkDocument>,
        private commonService: CommonService
    ) {
    }

    async getByArticle(articleId): Promise<any> {
        const rawComments = await this.commentModel
            .find({article_id: articleId})
            .lean()
            .exec();

        const commentsPromises = rawComments
            .map(async (comment) => {
                const commentWithPopulatedAuthor = await this.commonService.populateUser(comment)

                return await this.commonService.populateMarks(commentWithPopulatedAuthor)
            });

        return await Promise.all(commentsPromises);
    }
    async getCommentById(id: string): Promise<Comment> {

        const comment = await this.commentModel
            .findById(id)
            .lean()
            .exec();

        const commentWithPopulatedAuthor = await this.commonService.populateUser(comment)

        return await this.commonService.populateMarks(commentWithPopulatedAuthor)

    }

    async create(dto: CreateCommentDto, userId): Promise<any> {
        const comment = {
            ...dto,
            author: userId,
        }

        return await (new this.commentModel(comment).save())
    }


}
