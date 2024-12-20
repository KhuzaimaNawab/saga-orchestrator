import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import helmet from "helmet";
import { errorHandler } from "./internal";

const app = express();
dotenv.config({ path: ".env" });
app.use(express.json());
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);
app.use(helmet());

const v1ApiPrefix = "/api/v1";

app.use(errorHandler);

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
