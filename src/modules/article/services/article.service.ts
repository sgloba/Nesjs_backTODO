import { Injectable } from '@nestjs/common';
import {InjectModel} from "@nestjs/mongoose";
import {Article, ArticleDocument} from "../schemas/article.schema";
import {Model} from "mongoose";
import {CreateArticleDto} from "../dto/article-create.dto";
import * as admin from 'firebase-admin';
import * as uuid from 'uuid-v4';
import {CommonService} from "../../../services/common.service";


@Injectable()
export class ArticleService {
    constructor(
        @InjectModel(Article.name)
        private articleModel: Model<ArticleDocument>,
        private commonService: CommonService,
    ) { }

    async create(dto: CreateArticleDto, userId): Promise<any> {
        const article = {
            ...dto,
            author: userId,
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
            .lean()
            .exec()

        const articlesPromises = rawArticles
            .map(async (article) => {

                const articleWithPopulatedAuthor = await this.commonService.populateUser(article)

                return await this.commonService.populateMarks(articleWithPopulatedAuthor)
            });

        return await Promise.all(articlesPromises);
    }

    async getArticleById(id: string): Promise<Article> {
        const article = await this.articleModel
            .findById(id)
            .lean()
            .exec();

        const articleWithPopulatedAuthor = await this.commonService.populateUser(article)
        return await this.commonService.populateMarks(articleWithPopulatedAuthor)
    }

    async uploadFileToFirebase(fileImg) {
        const bucket = admin.storage().bucket()
        const rndId = uuid();
        const metadata = {
            metadata: {
                firebaseStorageDownloadTokens: uuid()
            },
            contentType: 'image',
        };

        await bucket.file(rndId).save(fileImg.buffer, {
            metadata
        });

        return `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${rndId}?alt=media&token=${metadata.metadata.firebaseStorageDownloadTokens}`;
    }

}
