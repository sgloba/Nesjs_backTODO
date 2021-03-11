import { Module } from '@nestjs/common';
import { ArticleController } from './controllers/article.controller';
import { ArticleService } from './services/article.service';
import {MongooseModule} from "@nestjs/mongoose";
import {Article, ArticleSchema} from "./schemas/article.schema";
import {Mark, MarkSchema} from "./schemas/mark.schema";
import {CommonService} from "../../services/common.service";
import {Comment, CommentSchema} from "../comment/schemas/comment.schema";

@Module({
  imports: [
      MongooseModule.forFeature(
          [
              {name: Article.name, schema: ArticleSchema},
              {name: Comment.name, schema: CommentSchema},
              {name: Mark.name, schema: MarkSchema},
          ])
  ],
  controllers: [ArticleController],
  providers: [ArticleService, CommonService]
})
export class ArticleModule {}
