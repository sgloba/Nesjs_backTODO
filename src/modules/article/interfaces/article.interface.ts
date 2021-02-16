import {TranslatablePropI} from "./translatable-prop.interface";
import {MarksI} from "./marks.interface";
import {CommentsI} from "./comments.interface";

export interface ArticleI {
    _id: string;
    title: TranslatablePropI[];
    author: string;
    body: TranslatablePropI[];
    preview: TranslatablePropI[];
    img: string;
    marks: MarksI[];
    comments: CommentsI[];
    tags: string[];
}