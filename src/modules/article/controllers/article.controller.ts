import {Body, Controller, Get, HttpStatus, Param, Post, Put, Res} from '@nestjs/common';
import {ArticleService} from "../services/article.service";
import {CreateArticleDto} from "../dto/article-create.dto";
import {Article, ArticleDocument} from "../schemas/article.schema";
import {UpdateArticleDto} from "../dto/article-update.dto";
import {ArticleI} from "../interfaces/article.interface";

@Controller('api/articles')
export class ArticleController {
    constructor(
        private articleService: ArticleService
    ) { }

    @Get()
    getAllArticles() {
        return this.articleService.getAll()
    }

    @Post()
    create(@Body() dto: CreateArticleDto): Promise<ArticleDocument> {
        return this.articleService.create(dto);
    }

    @Put(':id')
    update(@Param('id') id, @Body() dto: UpdateArticleDto): Promise<Article> {
        console.log('id', id)
        return this.articleService.update(id, dto);
    }
}
