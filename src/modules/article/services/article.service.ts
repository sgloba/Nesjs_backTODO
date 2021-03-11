import { Injectable } from '@nestjs/common';
import {InjectModel} from "@nestjs/mongoose";
import {Article, ArticleDocument} from "../schemas/article.schema";
import {Model} from "mongoose";
import {CreateArticleDto} from "../dto/article-create.dto";
import {UpdateArticleDto} from "../dto/article-update.dto";
import {Mark, MarkDocument} from "../schemas/mark.schema";
import * as admin from 'firebase-admin';
import {pick} from '../utils/object.utils';
import * as uuid from 'uuid-v4';


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
                    .getUser(article.author.uid);

                return {
                    ...article,
                    author: pick(user, ['uid', 'email', 'displayName', 'photoURL'])
                }
            });

        return await Promise.all(articlesPromises);
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
