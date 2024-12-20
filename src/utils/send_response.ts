import { Response } from "express";

export class SendResponse {
  public static get = (
    res: Response,
    message?: string,
    result?: any,
    sess?: number | string
  ) => {
    const responseBody: any = { success: true, message: message };
    if (result) responseBody.result = result;
    if (sess) responseBody.token = sess;
    return res.status(200).json(responseBody);
  };

  public static create = (res: Response, message: string, result?: any) => {
    const responseBody: any = { success: true, message: message };
    if (result) responseBody.result = result;
    return res.status(201).json(responseBody);
  };

  public static delete = (res: Response, message: string) => {
    const responseBody: any = { success: true, message: message };
    return res.status(200).json(responseBody);
  };

  public static update = (res: Response, message: string, result?: any) => {
    const responseBody: any = { success: true, message: message };
    if (result) responseBody.result = result;
    return res.status(200).json(responseBody);
  };
}
