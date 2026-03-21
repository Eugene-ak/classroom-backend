import express from "express";
import subjectsRouter from "./routes/subjects";
import { env } from "./env";
import cors from "cors";

const app = express();
const PORT = env.PORT;

app.use(
  cors({
    origin: env.FRONTEND_URL,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
  }),
);

app.use(express.json());

app.use("/api/subjects", subjectsRouter);

app.get("/", (_req, res) => {
  res.json({ message: "Classroom backend is running." });
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
