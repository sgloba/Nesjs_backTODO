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
import {Mark, MarkSchema} from "./modules/marks/schemas/mark.schema";
import { MarksModule } from './modules/marks/marks.module';
import {MarksService} from "./modules/marks/services/marks.service";

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
          ]),
      MarksModule
  ],
  controllers: [AppController],
  providers: [AppService, CommonService, MarksService],
})
export class AppModule {}
