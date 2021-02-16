import { Module } from '@nestjs/common';
import { ArticleController } from './controllers/article.controller';
import { ArticleService } from './services/article.service';
import {MongooseModule} from "@nestjs/mongoose";
import {Article, ArticleSchema} from "./schemas/article.schema";

@Module({
  imports: [MongooseModule.forFeature([{name: Article.name, schema: ArticleSchema}])],
  controllers: [ArticleController],
  providers: [ArticleService]
})
export class ArticleModule {}
