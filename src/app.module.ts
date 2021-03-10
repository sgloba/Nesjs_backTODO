import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {MongooseModule} from "@nestjs/mongoose";
import { ArticleModule } from './modules/article/article.module';
import {ConfigModule} from "@nestjs/config";
import { CommentModule } from './modules/comment/comment.module';

@Module({
  imports: [
      ConfigModule.forRoot(),
      MongooseModule.forRoot(process.env.MONGODB_URI),
      ArticleModule,
      CommentModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
