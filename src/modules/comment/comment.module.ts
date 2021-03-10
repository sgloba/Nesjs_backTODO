import { Module } from '@nestjs/common';
import { CommentService } from './services/comment.service';
import {MongooseModule} from "@nestjs/mongoose";
import {Mark, MarkSchema} from "../article/schemas/mark.schema";
import {Comment, CommentSchema} from "./schemas/comment.schema";
import { CommentController } from './controllers/comment.controller';

@Module({
  imports: [
    MongooseModule.forFeature(
        [
          {name: Comment.name, schema: CommentSchema},
          {name: Mark.name, schema: MarkSchema},
        ])
  ],
  providers: [CommentService],
  controllers: [CommentController],

})
export class CommentModule {}
