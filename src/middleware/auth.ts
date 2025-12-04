import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const auth = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "No token" });

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET as string);
    const slug = jwt.decode(token);

    if (typeof slug !== "string" && slug !== null)
      req.user = {
        slug: slug?.slug
      }

    next();
  } catch {
    res.status(401).json({ error: "Invalid token" });
  }
};
