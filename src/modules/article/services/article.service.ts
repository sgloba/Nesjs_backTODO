import { Injectable } from '@nestjs/common';
import {InjectModel} from "@nestjs/mongoose";
import {Article, ArticleDocument} from "../schemas/article.schema";
import {Model} from "mongoose";
import {CreateArticleDto} from "../dto/article-create.dto";
import {UpdateArticleDto} from "../dto/article-update.dto";

@Injectable()
export class ArticleService {
    constructor(
        @InjectModel(Article.name)
        private articleModel: Model<ArticleDocument>
    ) { }

    async create(dto: CreateArticleDto): Promise<ArticleDocument> {
        const article = {
            ...dto,
            author: 'test author',
            preview: [{lang: 'en', content: 'test preview'}],
            img: 'https://source.unsplash.com/random/220x220',
            marks: [],
            comments: [],
            tags: [],
        }

        return await (new this.articleModel(article).save())
    }

    async getAll({author, date, tags}): Promise<Article[]> {
        console.log('params ', author, date, tags)
        let query: any = {
            ...author && { author },
            ...date && { date },
            ...tags && { tags },
        }

        return await this.articleModel
            .find({...query})
            .lean()
            .exec();
    }

    async getById(id: string): Promise<Article> {
        return await this.articleModel
            .findById(id)
            .lean()
            .exec();
    }

    async update(id: string, dto: UpdateArticleDto): Promise<Article> {
        const user = dto.marks[0].user;
        const articleObj = await this.articleModel.findById(id).lean().exec();
        const userMark = articleObj.marks.find((mark) => mark.user === user);

        const newMarks = !userMark
            ? [...articleObj.marks, ...dto.marks]
            : [
                ...articleObj.marks
                    .filter((item) => item.user !== user),
                ...dto.marks
              ]

        return await this.articleModel
            .findByIdAndUpdate(
                id,
                {
                    marks: newMarks
                },
                { new: true }
            )
            .exec()
    }
}
