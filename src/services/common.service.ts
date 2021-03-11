import { Injectable } from '@nestjs/common';
import {Article, ArticleDocument} from "../modules/article/schemas/article.schema";
import {Comment, CommentDocument} from "../modules/comment/schemas/comment.schema";
import {Model} from "mongoose";
import * as admin from "firebase-admin";
import {pick} from "../modules/article/utils/object.utils";
import {UpdateArticleDto} from "../modules/article/dto/article-update.dto";
import {Mark, MarkDocument} from "../modules/article/schemas/mark.schema";
import {InjectModel} from "@nestjs/mongoose";

@Injectable()
export class CommonService {

    constructor(
        @InjectModel(Comment.name)
        private commentModel: Model<CommentDocument>,
        @InjectModel(Article.name)
        private articleModel: Model<ArticleDocument>,
        @InjectModel(Mark.name)
        private markModel: Model<MarkDocument>
    ) {
    }

    async getById(id: string, type: string): Promise<Article | Comment> {
        // let itemModel: Model<ArticleDocument> | Model<CommentDocument>;
        //
        // if(type === 'article') {
        //     itemModel = this.articleModel
        // }
        // if (type === 'comment') {
        //     itemModel = this.commentModel
        // }

        const item = await itemModel
            .findById(id)
            .populate({
                // path: 'marks',
                // select: ['rate', 'user']
            })
            // @ts-ignore
            .lean()
            .exec();

        // const user = await admin
        //     .auth()
        //     .getUser(item.author.uid)

        const itemWithPopulatedAuthor = this.someService.populateUser(item, 'author', {'uid', 'email', 'displayName', 'photoURL'})

        return {
            ...item,
            // author: pick(user, ['uid', 'email', 'displayName', 'photoURL'])
        }
    }

    async update(id: string, dto: UpdateArticleDto, type: string) {

        let itemModel: Model<ArticleDocument> | Model<CommentDocument>;

        if(type === 'article') {
            itemModel = this.articleModel
        }
        if (type === 'comment') {
            itemModel = this.commentModel
        }

        const user = dto.marks[0].user
        const item = await this.getById(id, type);
        const mark: any = await item.marks.find((item) => item.user === user);

        if (mark) {
            await this.markModel
                .findByIdAndUpdate(
                    mark._id,
                    { rate: mark.rate === dto.marks[0].rate ?  null : dto.marks[0].rate});

            return await this.getById(id, type);
        } else {
            const mark = await this.markModel.create({ rate: dto.marks[0].rate, user });

            // @ts-ignore
            await itemModel.findByIdAndUpdate(id, {
                $push: {
                    marks: mark._id,
                },
            }, { new: true })
                .populate({
                    path: 'marks',
                    model: Mark.name,
                    select: ['rate', 'user']
                })
                .lean()
                .exec();
            return await this.getById(id, type);
        }
    }
}
