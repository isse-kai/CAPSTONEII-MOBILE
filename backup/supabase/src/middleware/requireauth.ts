// import type { NextFunction, Request, Response } from "express";
// import { supabasePublic } from "../lib/supabasepublic";

// export type AuthedRequest = Request & {
//   user?: any;
// };

// export async function requireAuth(
//   req: AuthedRequest,
//   res: Response,
//   next: NextFunction,
// ) {
//   try {
//     const auth = req.headers.authorization || "";
//     const token = auth.startsWith("Bearer ") ? auth.slice(7) : "";

//     if (!token) {
//       return res.status(401).json({ detail: "Missing Authorization token." });
//     }

//     // ✅ Validate token with Supabase Auth
//     const { data, error } = await supabasePublic.auth.getUser(token);

//     if (error || !data?.user) {
//       return res.status(401).json({ detail: "Invalid or expired token." });
//     }

//     req.user = data.user;
//     next();
//   } catch (err: any) {
//     return res.status(500).json({ detail: err?.message || "Auth error." });
//   }
// }
