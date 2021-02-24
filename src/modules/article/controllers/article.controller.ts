import {Body, Controller, Get, Param, Post, Put, Query} from '@nestjs/common';
import {ArticleService} from "../services/article.service";
import {CreateArticleDto} from "../dto/article-create.dto";
import {Article, ArticleDocument} from "../schemas/article.schema";
import {UpdateArticleDto} from "../dto/article-update.dto";
import {User} from "../decorators/user.decorator";

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
    create(@Body() dto: CreateArticleDto, @User('user_id') userId): Promise<ArticleDocument> {
        return this.articleService.create(dto, userId);
    }

    @Put(':id')
    update(@Param('id') id, @Body() dto: UpdateArticleDto): Promise<Article> {
        return this.articleService.update(id, dto) as any;
    }
}
