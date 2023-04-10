import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import routes from "./routes/index.routes.js";
import { handleApplicationErrors } from "./middleware/errorMiddleware.js";

dotenv.config();


const app = express();
app.use(express.json());
app.use(cors());
app.use(routes);
app.use(handleApplicationErrors);

const port = process.env.USER_PORT;

app.listen(port, () =>
  console.log(`Server running in port: `+ port)
);