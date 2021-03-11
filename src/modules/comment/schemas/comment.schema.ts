import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import {Document} from "mongoose";


export type CommentDocument = Comment & Document;

@Schema()
export class Comment {
    @Prop()
    parent_comment_id: string;

    @Prop()
    article_id: string;

    @Prop(
        {
            type: {
                displayName: {type: String},
                email: {type: String},
                photoURL: {type: String},
                uid: {type: String},
            },
        }
    )
    author: any;

    @Prop()
    body: string;

    @Prop()
    timestamp: string;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
