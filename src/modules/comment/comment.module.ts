import { Module } from '@nestjs/common';
import { CommentService } from './services/comment.service';
import {MongooseModule} from "@nestjs/mongoose";
import {Mark, MarkSchema} from "../marks/schemas/mark.schema";
import {Comment, CommentSchema} from "./schemas/comment.schema";
import { CommentController } from './controllers/comment.controller';
import {Article, ArticleSchema} from "../article/schemas/article.schema";
import {CommonService} from "../../services/common.service";
import {MarksService} from "../marks/services/marks.service";

@Module({
  imports: [
    MongooseModule.forFeature(
        [
          {name: Comment.name, schema: CommentSchema},
          {name: Article.name, schema: ArticleSchema},
          {name: Mark.name, schema: MarkSchema},
        ])
  ],
  providers: [CommentService, CommonService, MarksService],
  controllers: [CommentController],

})
export class CommentModule {}
