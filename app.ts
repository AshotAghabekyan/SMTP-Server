import dotnenv from "dotenv"
import express from "express"
import https from "https";
import type {Express, Request, Response } from "express";
import mailRouter from "./src/mailRouter";
import path from "path";
import fs from "fs";


dotnenv.config()
const app: Express = express();
const httpsCredentials = {
    cert: fs.readFileSync('./cert/selfsigned.crt', "utf-8"),
    key: fs.readFileSync('./cert/selfsigned.key', "utf-8"),
}


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

const http_port = +process.env.PORT
const https_port = +process.env.HTTPS_PORT
const httpsServer = https.createServer(httpsCredentials, app);
httpsServer.listen(https_port, () => console.log('https server running on ', https_port))
app.listen(http_port, () => console.log('http server running on', http_port));