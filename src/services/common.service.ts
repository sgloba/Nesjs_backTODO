import { Injectable } from '@nestjs/common';
import * as admin from "firebase-admin";
import {pick} from "../modules/article/utils/object.utils";
import {MarksService} from "../modules/marks/services/marks.service";
import {Model} from "mongoose";
import {CommentDocument} from "../modules/comment/schemas/comment.schema";

@Injectable()
export class CommonService {
    constructor(
        private markService: MarksService,
) {
    }

   async populateUser(item) {
        const user = await admin
            .auth()
            .getUser(item.author.uid)
        return  await {
            ...item,
            author: pick(user, ['uid', 'email', 'displayName', 'photoURL'])
        }
    }

    async populateMarks(item, userId) {
        const marks = await this.markService.getMarks({target_id: item._id})
        const isLikedByUser = await this.markService.getMarks({target_id: item._id, user: userId, rate: 1})
        const isDislikedByUser = await this.markService.getMarks({target_id: item._id, user: userId, rate: -1})

        return {
            ...item,
            marks,
            userState: {
                isLikedByUser: isLikedByUser.length !== 0,
                isDislikedByUser: isDislikedByUser.length !== 0
            }
        }
    }

}
