import {TranslatablePropI} from "./translatable-prop.interface";
import {MarksI} from "./marks.interface";

export interface ArticleI {
    _id: string;
    title: TranslatablePropI[];
    author: any;
    body: TranslatablePropI[];
    preview: TranslatablePropI[];
    img: string;
    marks: MarksI[];
    tags: string[];
}
