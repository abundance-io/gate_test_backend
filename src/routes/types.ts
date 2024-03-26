import { Request } from "express";
//helper types for routes
export interface WrapBody<T> extends Request {
  body: T;
}

export interface Error {
  err: string;
}
