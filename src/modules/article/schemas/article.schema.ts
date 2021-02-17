import {Prop, raw, Schema, SchemaFactory} from "@nestjs/mongoose";
import {Document} from "mongoose";
import {TranslatablePropI} from "../interfaces/translatable-prop.interface";
import {CommentsI} from "../interfaces/comments.interface";
import {MarksI} from "../interfaces/marks.interface";
import {Mark} from "./mark.schema";
import * as mongoose from "mongoose";


export type ArticleDocument = Article & Document;

@Schema()
export class Article {
    @Prop({
        type: [{
            lang: String,
            content: String,
        }],
        _id: false
    })
    title: TranslatablePropI[];

    // @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: Mark.name }] })
    // title: ArticleTranslatable[]

    @Prop()
    author: string;

    @Prop(  {
        type: [{
            lang: String,
            content: String,
        }],
        _id: false
    })
    body: TranslatablePropI[];

    @Prop({
        type: [{
            lang: String,
            content: String,
        }],
        _id: false
    })
    preview: TranslatablePropI[];

    @Prop()
    img: string;

    @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: Mark.name }] })
    marks: Mark[];


    @Prop({
        type: [{
            author: {type: String},
            body: {type: String},
            timestamp: {type: Date, default: Date.now()},
        }],
        _id: false
    })
    comments: CommentsI[];

    @Prop()
    tags: string[];
}

export const ArticleSchema = SchemaFactory.createForClass(Article);