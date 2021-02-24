import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import {TokenI} from "../interfaces/token.interface";
import jwt from "jwt-decode";

export const User = createParamDecorator(
    (data: string, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest();
        const token = request.headers.secret_token;
        const user: TokenI = jwt(token);
        return data ? user?.[data] : user;
    },
);