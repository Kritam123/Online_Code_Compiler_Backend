import express from "express";
import { config } from "dotenv";
import { Server } from "socket.io";
import { createServer } from "node:http";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { dbConnect } from "./config/dbConnect";
import { compilerRoute } from "./routes/compilerRoutes";
import { userRouter } from "./routes/userRoutes";
// config
config();
const app = express();
// middleWares
app.use(cors({ credentials: true, origin: "http://localhost:5173" }));
app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));
app.use(helmet());
// routes
app.use("/api/v1/code", compilerRoute);
app.use("/api/v1/user", userRouter);
// db connect
dbConnect();
//
// socket integration
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});
io.on("connection", (socket) => {
  console.log("a user connected");
  socket.on("disconnect", () => {
    console.log("user disconnect");
  });
  socket.on("sentCode", (data) => {
    io.emit(`reciveCode:${data.codeId}`, data);
  });
});

server.listen(process.env.PORT, () => {
  console.log("Server connect at 4000");
});
