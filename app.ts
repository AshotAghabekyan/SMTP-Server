import dotnenv from "dotenv"
import express from "express"
import type {Express, Request, Response } from "express";
import mailRouter from "./src/mailRouter";
import path from "path";
import fs from "fs";


dotnenv.config()
const app: Express = express();

app.use("/static", express.static("./static"));
app.use(express.json());
app.use("/mail", mailRouter);


app.get("/", async (req: Request, res: Response) => {
    const htmlFilePath: string = path.resolve('./static/home.html');
    const file: string = await fs.promises.readFile(htmlFilePath, "utf-8");
    res.setHeader("Content-type", 'text/html');
    res.status(200).send(file);
    res.end();
})


app.listen(process.env.PORT, () => console.log('server running'));