import { Injectable } from '@nestjs/common';
import {UpdateArticleDto} from "../../article/dto/article-update.dto";
import {Model} from "mongoose";
import {Mark, MarkDocument} from "../schemas/mark.schema";
import {InjectModel} from "@nestjs/mongoose";

@Injectable()
export class MarksService {
    constructor(
        @InjectModel(Mark.name)
        private markModel: Model<MarkDocument>
    ) {
    }

    async setMark(target_id: string, dto: UpdateArticleDto) {
        const user = dto.marks[0].user
        const mark: MarkDocument = await this.markModel.findOne({target_id, user})

        if (mark) {
            await this.markModel
                .findByIdAndUpdate(
                    mark._id,
                    { rate: mark.rate === dto.marks[0].rate ?  null : dto.marks[0].rate});

            return true
        } else {
            await this.markModel.create({ rate: dto.marks[0].rate, target_id, user });
            return true
        }
    }

    getMarks(options) {
        return this.markModel.find(options)
    }
}
