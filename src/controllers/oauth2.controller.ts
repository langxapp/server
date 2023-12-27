import { Request, Response } from "express";
import { throwIfMissing } from "../utils/utils";

export default class OAuth2Controller {
  async redirect(req: Request, res: Response) {
    console.log("req: ", req);
    console.log("req.body: ", req.body);
    console.log("req.headers: ", req.headers);

    res.end("processing...");
  }
}