import express, { Application, Request, Response } from "express";
import cors from "cors";
import router from "./app/routes";
import { gobbleErrorHandler } from "./app/middlewares/globalErrorHandler";
const app: Application = express();

app.use(cors());

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
