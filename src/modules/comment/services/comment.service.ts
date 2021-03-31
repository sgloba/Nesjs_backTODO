import {Injectable} from '@nestjs/common';
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

    async getByArticle(
        articleId: string,
        userId: string,
        commentPage: number = 0,
        articlePage: number = 0,
        parent_comment_id: string = ''
    ): Promise<any> {
        const perPage = 2;

        const rawComments = await this.commentModel
            .find({article_id: articleId, parent_comment_id})
            .limit(perPage)
            .skip(parent_comment_id === '' ? perPage*articlePage : perPage*commentPage)
            .lean()
            .exec();

        const countArticle = await this.commentModel
            .find({article_id: articleId, parent_comment_id: '' })
            .count();

        const commentsPromises = rawComments
            .map(async (comment) => {
                return await this.commonService.populateUser(comment)
                    .then((comment) => this.commonService.populateMarks(comment, userId))
                    .then(async (comment) => {
                       const countComment = await this.commentModel
                            .find({parent_comment_id: comment._id})
                            .count()

                        return  {...comment, hasNextPage: !(countComment - (perPage * commentPage) <= perPage)}
                    })
                    .then((comment) => this.populateReplies(comment))
                    .then((comment) => ({...comment, currentPage: +commentPage}))
            });

        return { comments: await Promise.all(commentsPromises), hasNextPage: !(countArticle - (perPage * articlePage) <= perPage) }
    }
    async getCommentById(id: string, userId: string, page: number = 0): Promise<any> {
        const perPage = 2;
        const count = await this.commentModel
            .find({parent_comment_id: id})
            .count();

        const comment = await this.commentModel
            .findById(id)
            .limit(perPage)
            .skip(perPage*page)
            .lean()
            .exec()
            .then((comment) => this.commonService.populateUser(comment))
            .then((comment) => this.commonService.populateMarks(comment, userId))
            .then((comment) => ({...comment, hasNextPage: !(count - (perPage * page) <= perPage)}))
            .then((comment) => this.populateReplies(comment))
            .then((comment) => ({...comment, currentPage: +page,}));

        return {comments: [comment]}
    }

    async create(dto: CreateCommentDto, userId): Promise<any> {
        const comment = {
            ...dto,
            author: userId,
        }

        return (await (new this.commentModel(comment).save()) as any).toObject();
    }

    async populateReplies(item) {
        const replies = await this.commentModel.count({parent_comment_id: item._id})

        return {
            ...item,
            replies
        }
    }



}
