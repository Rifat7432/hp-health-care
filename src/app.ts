import express, { Application, Request, Response } from "express";
import cors from "cors";
import router from "./app/routes";
import { gobbleErrorHandler } from "./app/middlewares/globalErrorHandler";
import { PrismaClient } from "@prisma/client";
import cookieParser from 'cookie-parser';

const app: Application = express();
export const prisma = new PrismaClient();
app.use(cors());
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({extended:true}))


app.get('/',(req: Request, res: Response) => {
  res.send({
    massage: "Hello world",
  });
});
app.use('/api', router);
app.use(gobbleErrorHandler.gobbleError);
app.use(gobbleErrorHandler.notFound);
export default app;
