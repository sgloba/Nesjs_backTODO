import { Injectable } from '@nestjs/common';
import {InjectModel} from "@nestjs/mongoose";
import {Model} from "mongoose";
import {Mark, MarkDocument} from "../../article/schemas/mark.schema";
import {Comment, CommentDocument} from "../schemas/comment.schema";
import {CreateCommentDto} from "../dto/comment-create.dto";
import * as admin from "firebase-admin";
import {pick} from "../../article/utils/object.utils";
import {Article, ArticleDocument} from "../../article/schemas/article.schema";

@Injectable()
export class CommentService {
    constructor(
        @InjectModel(Comment.name)
        private commentModel: Model<CommentDocument>,

        @InjectModel(Article.name)
        private articleModel: Model<ArticleDocument>,

        @InjectModel(Mark.name)
        private markModel: Model<MarkDocument>
    ) {
    }

    async getByArticle(articleId): Promise<any> {


        const rawComments = await this.commentModel
            .find({article_id: articleId})
            .populate({
                path: 'marks',
                select: ['rate', 'user']
            })
            .lean()
            .exec();

        const commentsPromises = rawComments
            .map(async (comment) => {

                const user = await admin
                    .auth()
                    .getUser(comment.author.uid);

                return {
                    ...comment,
                    author: pick(user, ['uid', 'email', 'displayName', 'photoURL'])
                }
            });

        return await Promise.all(commentsPromises);
    }

    async create(dto: CreateCommentDto, userId): Promise<any> {
        const comment = {
            ...dto,
            author: userId,
        }

        return await (new this.commentModel(comment).save())
    }


}
