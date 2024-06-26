import { Request, Response } from "express";
import "dotenv/config";
import {
  Client,
  Databases,
  Account,
  Permission,
  Role,
  ID,
} from "node-appwrite";

// Utils
import { throwIfMissing } from "../utils/utils";

const env: any = {
  APP_ENDPOINT: process.env.APP_ENDPOINT as string,
  APP_PROJECT: process.env.APP_PROJECT as string,
  APP_DATABASE: process.env.APP_DATABASE as string,
  API_KEY: process.env.API_KEY as string,
  USERS_COLLECTION: process.env.USERS_COLLECTION as string,
  MESSAGES_COLLECTION: process.env.MESSAGES_COLLECTION as string,
  ROOMS_COLLECTION: process.env.ROOMS_COLLECTION as string,
  LANGUAGES_COLLECTION: process.env.LANGUAGES_COLLECTION as string,
};

export default class LanguageController {
  async create(req: Request, res: Response) {
    try {
      console.log("create language");
      // console.log(req.headers["x-appwrite-user-id"]);
      // console.log(req.headers["x-appwrite-jwt"]);
      throwIfMissing(req.headers, ["x-appwrite-user-id", "x-appwrite-jwt"]);
      if (!req.body || Object.keys(req.body).length === 0) {
        console.log("Request body is empty.");
        return res
          .status(400)
          .json({ ok: false, error: "Request body is empty." });
      }

      const sender: string = req.headers["x-appwrite-user-id"] as string;
      const jwt: string = req.headers["x-appwrite-jwt"] as string;

      // console.log(`sender: ${sender}`);
      // console.log(`jwt: ${jwt}`);

      // Set data to variables
      const data: any = req.body;
      console.log(data);

      const disallowedFields = ["userId"];

      for (const field of disallowedFields) {
        if (data.hasOwnProperty(field)) {
          console.log(`Disallowed field "${field}" found in request body.`);
          return res
            .status(400)
            .json({ ok: false, error: `Field "${field}" is not allowed.` });
        }
      }

      // Add userId to data
      data.userId = sender;

      // Check JWT
      const verifyUser = new Client()
        .setEndpoint(env.APP_ENDPOINT)
        .setProject(env.APP_PROJECT)
        .setJWT(jwt);

      const account = new Account(verifyUser);
      const user = await account.get();
      // console.log(`user: ${JSON.stringify(user)}`);

      if (user.$id !== sender) {
        return res.status(400).json({ ok: false, error: "jwt is invalid" });
      }

      const client = new Client()
        .setEndpoint(env.APP_ENDPOINT)
        .setProject(env.APP_PROJECT)
        .setKey(env.API_KEY);

      const database = new Databases(client);

      // Create user data
      console.log("Creating language doc...", data);
      const response = await database.createDocument(
        env.APP_DATABASE,
        env.LANGUAGES_COLLECTION,
        ID.unique(),
        data,
        [Permission.delete(Role.user(sender))]
      );

      return res.send(response);
    } catch (err) {
      res.status(500).json({
        message: "Internal Server Error!",
        err: err,
      });
    }
  }

  async update(req: Request, res: Response) {
    try {
      console.log("update language");
      throwIfMissing(req.headers, ["x-appwrite-user-id", "x-appwrite-jwt"]);
      throwIfMissing(req.params, ["id"]);
      if (!req.body || Object.keys(req.body).length === 0) {
        console.log("Request body is empty.");
        return res
          .status(400)
          .json({ ok: false, error: "Request body is empty." });
      }

      const sender: string = req.headers["x-appwrite-user-id"] as string;
      const jwt: string = req.headers["x-appwrite-jwt"] as string;

      // Set data to variables
      const id: string = req.params.id;
      const data: any = req.body;

      const disallowedFields = ["userId"];

      for (const field of disallowedFields) {
        if (data.hasOwnProperty(field)) {
          console.log(`Disallowed field "${field}" found in request body.`);
          return res
            .status(400)
            .json({ ok: false, error: `Field "${field}" is not allowed.` });
        }
      }

      // Check JWT
      const verifyUser = new Client()
        .setEndpoint(env.APP_ENDPOINT)
        .setProject(env.APP_PROJECT)
        .setJWT(jwt);

      const account = new Account(verifyUser);
      const user = await account.get();

      if (user.$id !== sender) {
        return res.status(400).json({ ok: false, error: "jwt is invalid" });
      }

      const client = new Client()
        .setEndpoint(env.APP_ENDPOINT)
        .setProject(env.APP_PROJECT)
        .setKey(env.API_KEY);

      const database = new Databases(client);

      // Update language data
      console.log("Updating language data...", data);
      const response = await database.updateDocument(
        env.APP_DATABASE,
        env.LANGUAGES_COLLECTION,
        id,
        data
      );

      return res.send(response);
    } catch (err) {
      res.status(500).json({
        message: "Internal Server Error!",
        err: err,
      });
    }
  }
}
