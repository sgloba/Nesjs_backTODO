import { Injectable } from '@nestjs/common';
import {InjectModel} from "@nestjs/mongoose";
import {Article, ArticleDocument} from "../schemas/article.schema";
import {Model} from "mongoose";
import {CreateArticleDto} from "../dto/article-create.dto";
import {UpdateArticleDto} from "../dto/article-update.dto";
import {Mark, MarkDocument} from "../schemas/mark.schema";

@Injectable()
export class ArticleService {
    constructor(
        @InjectModel(Article.name)
        private articleModel: Model<ArticleDocument>,
        @InjectModel(Mark.name)
        private markModel: Model<MarkDocument>
    ) { }

    async create(dto: CreateArticleDto): Promise<ArticleDocument> {
        const article = {
            ...dto,
            preview: [{lang: 'en', content: 'test preview'}],
            img: 'https://source.unsplash.com/random/220x220',
            comments: [],
            tags: [],
        }

        return await (new this.articleModel(article).save())
    }

    async getAll({author, date, tags}): Promise<Article[]> {
        let query: any = {
            ...author && { author },
            ...date && { date },
            ...tags && { tags },
        }

        return await this.articleModel
            .find({...query})
            .populate({
                path: 'marks',
                select: ['rate', 'user']
            })
            .lean()
            .exec();
    }

    async getById(id: string): Promise<Article> {
        return await this.articleModel
            .findById(id)
            .populate({
                path: 'marks',
                select: ['rate', 'user']
            })
            .lean()
            .exec();
    }

    async update(id: string, dto: UpdateArticleDto) {
        const user = dto.marks[0].user
        const article = await this.getById(id);
        const mark: any = await article.marks.find((item) => item.user === user);

        if (mark) {
            await this.markModel.findByIdAndUpdate(mark._id, { rate: dto.marks[0].rate });
            return await this.getById(id);
        } else {
            const mark = await this.markModel.create({ rate: dto.marks[0].rate, user });

            return await this.articleModel.findByIdAndUpdate(id, {
                $push: {
                    marks: mark._id
                }
            }, { new: true })
                .populate({
                    path: 'marks',
                    model: Mark.name,
                    select: ['rate', 'user']
                })
                .lean()
                .exec();
        }
    }

    // async update(id: string, dto: UpdateArticleDto): Promise<Article> {
    //     const user = dto.marks[0].user;
    //     const articleObj = await this.articleModel.findById(id).lean().exec();
    //     const userMark = articleObj.marks.find((mark) => mark.user === user);
    //
    //     const newMarks = !userMark
    //         ? [...articleObj.marks, ...dto.marks]
    //         : [
    //             ...articleObj.marks
    //                 .filter((item) => item.user !== user),
    //             ...dto.marks
    //           ]
    //
    //     return await this.articleModel
    //         .findByIdAndUpdate(
    //             id,
    //             {
    //                 marks: newMarks
    //             },
    //             { new: true }
    //         )
    //         .exec()
    // }
}
