import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import fs from "fs";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import routes from "./routes";

dotenv.config();

const uploadsPath = path.resolve(process.cwd(), "uploads");

if (!fs.existsSync(uploadsPath)) {
   fs.mkdirSync(uploadsPath);
}

const app = express();
const port = process.env.PORT || 3000;

app.use(helmet());
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/uploads", express.static(uploadsPath));

app.use("/api", routes);

app.use(
   (
      err: any,
      req: express.Request,
      res: express.Response,
      next: express.NextFunction,
   ) => {
      console.error(err.stack);
      res.status(500).json({
         success: false,
         message: "Something went wrong!",
         error:
            process.env.NODE_ENV === "development" ? err.message : undefined,
      });
   },
);

app.listen(port, () => {
   console.log(`Server is running on port ${port}`);
});

export default app;
