import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import {Document} from "mongoose";


export type MarkDocument = Mark & Document;

@Schema()
export class Mark {

    @Prop()
    user: string;

    @Prop()
    rate: number;

}

export const MarkSchema = SchemaFactory.createForClass(Mark);