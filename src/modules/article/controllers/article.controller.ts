import {Body, Controller, Get, HttpStatus, Param, Post, Put, Query, Res} from '@nestjs/common';
import {ArticleService} from "../services/article.service";
import {CreateArticleDto} from "../dto/article-create.dto";
import {Article, ArticleDocument} from "../schemas/article.schema";
import {UpdateArticleDto} from "../dto/article-update.dto";

@Controller('api/articles')
export class ArticleController {
    constructor(
        private articleService: ArticleService
    ) { }

    @Get()
    getAllArticles(@Query() params) {
        return this.articleService.getAll(params)
    }

    @Get(':id')
    getById(@Param('id') id) {
        return this.articleService.getById(id);
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
