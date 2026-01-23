// import { Router } from "express";
// import { requireAuth, type AuthedRequest } from "../middleware/requireauth";

// export const userRouter = Router();

// // GET /user/me
// userRouter.get("/me", requireAuth, async (req: AuthedRequest, res) => {
//   const user = req.user;

//   return res.json({
//     ok: true,
//     id: user.id,
//     email_address: user.email,
//     role: user.user_metadata?.role || "client",
//     first_name: user.user_metadata?.first_name || "",
//     last_name: user.user_metadata?.last_name || "",
//     sex: user.user_metadata?.sex || "",
//   });
// });
