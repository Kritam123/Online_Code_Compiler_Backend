import { NextFunction, Response, Request } from "express";
import jwt, { JsonWebTokenError } from "jsonwebtoken";
export interface AuthRequest extends Request {
  _id?: string;
}
export const authToken = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.cookies?.token;
    if (!token) {
      return res.status(401).send({ message: "You are unauthorized." });
    }
    jwt.verify(
      token,
      process.env.JWT_KEY!,
      (err: JsonWebTokenError | null, data: any) => {
        if (err) {
          return res.status(401).send({ message: "You are unauthorized." });
        }
        req._id = data._id;
        next();
      }
    );
  } catch (error) {
    return res.status(500).send({ message: "Internal Server Error" });
  }
};
