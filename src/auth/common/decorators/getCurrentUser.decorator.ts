import { ExecutionContext, createParamDecorator } from '@nestjs/common';

export const getCurrentUser = createParamDecorator(
  //createParamDecorator -> for creating custom Parameter decorator
  (data: string | undefined, ctx: ExecutionContext) => {
    //ExecutionContext -> information related to the current request -> represents the context in which an HTTP request is being processed
    const req = ctx.switchToHttp().getRequest(); //switchToHttp -> handling http-specific requests
    if (!data) return req.user;

    // console.log(data);
    // console.log(req.user[data]);

    // console.log(req.user);

    return req.user[data];
  },
);
