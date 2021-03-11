import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {MongooseModule} from "@nestjs/mongoose";
import { ArticleModule } from './modules/article/article.module';
import {ConfigModule} from "@nestjs/config";
import { CommentModule } from './modules/comment/comment.module';
import { CommonService } from './services/common.service';
import {Comment, CommentSchema} from "./modules/comment/schemas/comment.schema";
import {Article, ArticleSchema} from "./modules/article/schemas/article.schema";
import {Mark, MarkSchema} from "./modules/article/schemas/mark.schema";

@Module({
  imports: [
      ConfigModule.forRoot(),
      MongooseModule.forRoot(process.env.MONGODB_URI),
      ArticleModule,
      CommentModule,
      MongooseModule.forFeature(
          [
              {name: Comment.name, schema: CommentSchema},
              {name: Article.name, schema: ArticleSchema},
              {name: Mark.name, schema: MarkSchema},
          ])
  ],
  controllers: [AppController],
  providers: [AppService, CommonService],
})
export class AppModule {}
