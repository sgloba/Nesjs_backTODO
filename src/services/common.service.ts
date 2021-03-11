import { Injectable } from '@nestjs/common';
import * as admin from "firebase-admin";
import {pick} from "../modules/article/utils/object.utils";
import {MarksService} from "../modules/marks/services/marks.service";

@Injectable()
export class CommonService {
    constructor(
        private markService: MarksService
    ) {
    }

   async populateUser(item) {
        const user = await admin
            .auth()
            .getUser(item.author.uid)
        return {
            ...item,
            author: pick(user, ['uid', 'email', 'displayName', 'photoURL'])
        }
    }

    async populateMarks(item) {
        const marks = await this.markService.getMarks({target_id: item._id})

        return {
            ...item,
            marks
        }
    }

}
