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

    async getAll(): Promise<Article[]> {
        return await this.articleModel
            .find()
            .lean()
            .exec();
    }

    async getById(id: string): Promise<Article> {
        return await this.articleModel
            .findById(id)
            .lean()
            .exec();
    }

    async getByAuthor(author): Promise<Article[]> {
        return await this.articleModel
            .find(
                {
                    author
                }
            )
            .lean()
            .exec()
    }

    async update(id: string, dto: UpdateArticleDto): Promise<Article> {
        return await this.articleModel.findOneAndUpdate({_id: id}, dto,{new: true})
            .exec()
    }
}
