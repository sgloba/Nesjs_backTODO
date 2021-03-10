import {
    Body,
    Controller,
    Get,
    Param,
    Post,
    Put,
    Query,
    UploadedFile,
    UseInterceptors
} from '@nestjs/common';
import {ArticleService} from "../services/article.service";
import {CreateArticleDto} from "../dto/article-create.dto";
import {Article} from "../schemas/article.schema";
import {UpdateArticleDto} from "../dto/article-update.dto";
import {User} from "../decorators/user.decorator";
import {FileInterceptor} from "@nestjs/platform-express";
import {ParseJSONPipe} from "../pipes/parseJSONPipe";




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
    @UseInterceptors(FileInterceptor('fileImg'))
    async create(
        @UploadedFile() fileImg: Express.Multer.File,
        @Body(new ParseJSONPipe({
            omit: ['fileImg']
        })) dto: CreateArticleDto,
        @User('user_id') userId
    ) {

        const author = { uid: userId}
        const body = {...dto, img: await this.articleService.uploadFileToFirebase(fileImg)}

        return await this.articleService.create(body, author);

    }

    @Put(':id')
    update(@Param('id') id, @Body() dto: UpdateArticleDto): Promise<Article> {
        return this.articleService.update(id, dto) as any;
    }
}
