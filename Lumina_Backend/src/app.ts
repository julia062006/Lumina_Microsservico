import express from "express";
import router from "./router";
import cors from "cors";
import "dotenv/config";
import path from "path";
import { tratarErroMulter } from "./middlewares/tratarErroMulter";

const app = express();
app.use(express.json());

app.use(cors());

app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));

app.use(router);

app.use(tratarErroMulter);

export default app;

