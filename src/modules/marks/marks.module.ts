import { Module } from '@nestjs/common';
import { MarksService } from './services/marks.service';
import {MongooseModule} from "@nestjs/mongoose";
import {Mark, MarkSchema} from "./schemas/mark.schema";

@Module({
  imports: [
    MongooseModule.forFeature(
        [
          {name: Mark.name, schema: MarkSchema},
        ])
  ],
  providers: [MarksService]
})
export class MarksModule {}
