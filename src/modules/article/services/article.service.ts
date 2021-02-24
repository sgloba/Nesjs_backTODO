import { Injectable } from '@nestjs/common';
import {InjectModel} from "@nestjs/mongoose";
import {Article, ArticleDocument} from "../schemas/article.schema";
import {Model} from "mongoose";
import {CreateArticleDto} from "../dto/article-create.dto";
import {UpdateArticleDto} from "../dto/article-update.dto";
import {Mark, MarkDocument} from "../schemas/mark.schema";
import * as admin from 'firebase-admin';
import {pick} from '../utils/object.utils';


@Injectable()
export class ArticleService {
    constructor(
        @InjectModel(Article.name)
        private articleModel: Model<ArticleDocument>,
        @InjectModel(Mark.name)
        private markModel: Model<MarkDocument>
    ) { }

    async create(dto: CreateArticleDto, userId): Promise<any> {
        const article = {
            ...dto,
            author: userId,
            img: 'https://source.unsplash.com/random/220x220',
            comments: [],
        }

        return await (new this.articleModel(article).save())
    }

    async getAll({author, date, tags}): Promise<any> {

        let query = {
            ...author && { author },
            ...date && { date },
            ...tags && { tags },
        }

        const rawArticles = await this.articleModel
            .find(query)
            .populate({
                path: 'marks',
                select: ['rate', 'user']
            })
            .lean()
            .exec();

        const articlesPromises = rawArticles
            .map(async (article) => {
                const user = await admin
                    .auth()
                    .getUser(article.author);
                return {
                    ...article,
                    author: pick(user, ['uid', 'email', 'displayName', 'photoURL'])
                }
            });

        return await Promise.all(articlesPromises);
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
            await this.markModel
                .findByIdAndUpdate(
                    mark._id,
                    { rate: mark.rate === dto.marks[0].rate ?  null : dto.marks[0].rate});
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

}
