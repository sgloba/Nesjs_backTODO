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
import {UpdateArticleDto} from "../dto/article-update.dto";
import {User} from "../decorators/user.decorator";
import {FileInterceptor} from "@nestjs/platform-express";
import {ParseJSONPipe} from "../pipes/parseJSONPipe";
import {MarksService} from "../../marks/services/marks.service";


@Controller('api/articles')
export class ArticleController {
    constructor(
        private articleService: ArticleService,
        private marksService: MarksService
    ) {
    }

    @Get()
    getAllArticles(
        @Query() params,
        @User('user_id') userId
    ) {
        return this.articleService.getAll(params, userId)
    }

    @Get(':id')
    getById(@Param('id') id) {
        return this.articleService.getArticleById(id);
    }

    @Post()
    @UseInterceptors(FileInterceptor('fileImg'))
    async create(
        @UploadedFile() fileImg: Express.Multer.File,
        @Body(new ParseJSONPipe({
            omit: ['fileImg']
        })) dto: CreateArticleDto,
        @User('user_id') userId: string
    ) {
        const author = {uid: userId}
        const body = {...dto, img: await this.articleService.uploadFileToFirebase(fileImg)}

        return await this.articleService.create(body, author);
    }

    @Put(':id')
    update(@Param('id') id, @Body() dto: UpdateArticleDto): Promise<void> {
        return this.marksService.setMark(id, dto);
    }
}
