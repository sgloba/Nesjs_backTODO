export interface CommentI {
    _id?: string;
    parent_comment_id: string;
    article_id: string;
    body: string;
    author: {
        uid: string;
        email: string;
        displayName: string;
        photoURL: string;
    };
    timestamp: string;
    marks: {user: string, rate: number}[];
}
