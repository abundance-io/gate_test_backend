import { Request } from "express";

export interface WrapBody<T> extends Request {
  body: T;
}
