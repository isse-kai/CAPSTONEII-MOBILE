// // src/server.ts
// import cors from "cors";
// import "dotenv/config";
// import express from "express";
// import { authRouter } from "./routes/auth.routes";
// import { userRouter } from "./routes/user.routes";

// const app = express();

// app.use(
//   cors({
//     origin: "*", // ✅ dev
//     methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
//     allowedHeaders: ["Content-Type", "Authorization"],
//   }),
// );

// app.use(express.json({ limit: "1mb" }));

// app.get("/", (_req, res) => res.json({ ok: true, name: "API running" }));

// // ✅ routes
// app.use("/auth", authRouter);
// app.use("/user", userRouter);

// const port = Number(process.env.PORT || 8081);

// app.listen(port, "0.0.0.0", () => {
//   console.log(`Backend running on http://0.0.0.0:${port}`);
// });
